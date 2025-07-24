<template>
    <div
        v-if="!loading"
        class="editors-dashboard"
    >
        <div class="editors-dashboard--top-control">
            <common-button
                primary-color="error500"
                width="fit-content"
                @click="navigateTo('/dashboard')"
            >
                Back
            </common-button>
        </div>
        <div class="editors-dashboard--item-list">
            <template
                v-for="field in fields"
                :key="field.key"
            >
                <template v-if="!isHidden(field)">
                    <template v-if="field.key">
                        <common-input-text
                            v-if="field.type === 'text'"
                            v-model="editState[field.key]"
                            :disabled="field.readonly"
                            :placeholder="field.placeholder"
                        >{{ field.label }}</common-input-text>

                        <common-input-text
                            v-else-if="field.type === 'number'"
                            v-model="editState[field.key]"
                            input-type="number"
                            :placeholder="field.placeholder"
                        >{{ field.label }}</common-input-text>

                        <common-date-picker
                            v-else-if="field.type === 'date'"
                            v-model="editState[field.key]"
                        >
                            {{ field.label }}
                        </common-date-picker>

                        <common-checkbox
                            v-else-if="field.type === 'checkbox'"
                            v-model="editState[field.key]"
                            :label="field.label"
                        >
                            {{ field.label }}</common-checkbox>


                        <template v-else>
                            Type does not exist
                        </template>
                    </template>
                    <template v-else>
                        <basic-adders-helper
                            v-if="field.type === 'choice' && field.choiceFactory"
                            :factory="field.choiceFactory"
                            :label="field.label"
                        />
                    </template>
                </template>
            </template>
        </div>
        <div
            class="editors-dashboard--item-list-controls"
        >
            <common-button
                primary-color="success700"
                @click="invSave"
            >
                <template #icon>
                    <div class="editors-dashboard--item-list-controls--button-icon-wrap">
                        <transition>
                            <save-icon
                                v-if="!saveAnim"
                                class="editors-dashboard--item-list-controls--button-icon"
                            />
                            <check-icon
                                v-else
                                class="editors-dashboard--item-list-controls--button-icon"
                            />
                        </transition>
                    </div>
                </template>
            </common-button>
            <common-button
                v-if="deleteFn"
                primary-color="error600"
                @click="invDelete"
            >
                <template #icon>
                    <delete-icon/>
                </template>
            </common-button>
        </div>
    </div>
    <div v-else>
        <common-loader/>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import DeleteIcon from '~/assets/icons/delete.svg?component';
import SaveIcon from '~/assets/icons/save.svg?component';
import CheckIcon from '~/assets/icons/check.svg?component';
import CommonButton from '~/components/common/CommonButton.vue';
import CommonLoader from '../common/CommonLoader.vue';
import CommonCheckbox from '../common/CommonCheckbox.vue';
import CommonInputText from '../common/CommonInputText.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import BasicAddersHelper from './BasicAddersHelper.vue';
import type { PropType } from 'vue';
import type { ZodIssue } from 'zod';
import type { UpdateFactory } from './BasicAddersHelper.vue';

export interface FieldSchema<T extends Record<string, any>, U extends Record<string, any> = any> {
    key?: keyof T & string;
    type: 'checkbox' | 'text' | 'date' | 'number' | 'choice';
    label: string;
    placeholder?: string;
    hides?: keyof T & string;
    choiceFactory?: UpdateFactory<U>;
    readonly?: boolean;
}

const props = defineProps({
    deleteFn: {
        type: Function as PropType<(params: { where: any }) => Promise<any>>,
    },
    saveFn: {
        type: Function as PropType<(params: { where: any; data: any }) => Promise<any>>,
        required: true,
    },
    where: {
        type: Object as PropType<Record<string, any>>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
    fields: {
        type: Array as PropType<FieldSchema<T>[]>,
        required: true,
    },
    defaultValues: {
        type: Object as PropType<Record<string, any> | undefined>,
    },
});

const saveAnim = ref(false);

const fieldDefaultValues: ComputedRef<Record<string, any>> = computed(() => {
    return props.fields
        .map(field => field.key)
        .filter((key): key is string => !!key)
        .reduce((acc, key) => {
            if (props.defaultValues && key in props.defaultValues) {
                acc[key] = props.defaultValues[key];
            }
            return acc;
        }, {} as Record<string, any>);
});

const editState: Ref<Record<string, any>> = ref({});

watch(fieldDefaultValues, newVal => {
    editState.value = structuredClone(newVal);
}, { immediate: true });

function isHidden(field: FieldSchema<T>) {
    const hider = props.fields.find(x => x.hides === field.key);
    if (!hider || !hider.key) {
        return false;
    }

    return !editState.value[hider.key];
}

function invDelete() {
    if (props.deleteFn && confirm('Are you sure you want to delete this?')) {
        props.deleteFn({ where: props.where }).then(data => {
            navigateTo('/dashboard');
        }).catch(error => {
            if (error && error.info.zodErrors && Array.isArray(error.info.zodErrors.issues)) {
                const messages = error.info.zodErrors.issues.map((issue: ZodIssue) => `${ issue.path.join('.') }: ${ issue.message }`).join('\n');
                alert(messages);
            }
            else if (error?.message) {
                alert(error.message);
            }
            else {
                alert('An unexpected error occurred.');
                console.log(error);
            }
        });
    }
}

function invSave() {
    props.saveFn({ where: props.where, data: editState.value }).catch(error => {
        if (error && error.info?.zodErrors && Array.isArray(error.info.zodErrors.issues)) {
            const messages = error.info.zodErrors.issues.map((issue: ZodIssue) => `${ issue.path.join('.') }: ${ issue.message }`).join('\n');
            alert(messages);
            console.log(messages);
        }
        else if (error?.message) {
            alert(error.message);
            console.log(error.message);
        }
        else {
            alert('An unexpected error occurred.');
            console.log(error);
        }
    }).then(() => saveAnimation());
}

function saveAnimation() {
    saveAnim.value = true;

    setTimeout(() => {
        saveAnim.value = false;
    }, 2000);
}
</script>

<style scoped lang="scss">
.editors-dashboard {
    display: flex;
    flex-direction: column;
    gap: 24px;

    min-height: 100vh;
    padding: 64px;

    background: linear-gradient(to bottom, varToRgba('darkgray950', 0.5), varToRgba('darkgray900', 0.5));

    &--top-control {
        display: flex;
        justify-content: end;
        margin-bottom: 8px;
    }

    &--control {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    &--item-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: start;
        justify-content: center;

        padding: 24px;
        border: 1px solid varToRgba('primary500', 0.1);
        border-radius: 12px;

        background: linear-gradient(145deg, $darkgray875, $darkgray850);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

        &-controls {
            display: flex;
            flex-direction: row;
            gap: 12px;
            justify-content: end;

            margin-top: 8px;
            padding: 8px 0;

            &--button-icon {
                position: absolute;
                top: 0;
                left: 0;
                width: 20px;

                &-wrap {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
            }
        }

        &-empty {
            padding: 16px;
            font-style: italic;
            color: $lightgray300;
            text-align: center;
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
