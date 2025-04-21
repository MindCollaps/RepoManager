<template>
    <div
        v-if="!loading"
        class="editors-dashboard"
    >
        <div class="editors-dashboard--top-control">
            <common-button
                primary-color="error500"
                width="fit-content"
                @click="router.push('/dashboard')"
            >
                Back
            </common-button>
        </div>
        <div class="editors-dashboard--item-list">
            <template
                v-for="field in fields"
                :key="field.key"
            >
                <common-input-text
                    v-if="field.type === 'text'"
                    v-model="editState[field.key]"
                    :placeholder="field.placeholder"
                >{{ field.label }}</common-input-text>

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
        </div>
        <div
            class="editors-dashboard--item-list-controls"
        >
            <common-button
                primary-color="success700"
                @click="invSave"
            >
                <template #icon>
                    <save-icon/>
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

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import DeleteIcon from '~/assets/icons/delete.svg?component';
import SaveIcon from '~/assets/icons/save.svg?component';
import CommonLoader from '../common/CommonLoader.vue';
import CommonCheckbox from '../common/CommonCheckbox.vue';
import CommonInputText from '../common/CommonInputText.vue';
import type { PropType } from 'vue';
import type { ZodIssue } from 'zod';

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
        type: Array as PropType<FieldSchema[]>,
        required: true,
    },
    defaultValues: {
        type: Object as PropType<Record<string, any> | undefined>,
        required: true,
    },
});

defineSlots<{
    default(): any;
}>();

const router = useRouter();

export interface FieldSchema<T extends Record<string, any> = any> {
    key: keyof T & string;
    type: 'checkbox' | 'text' | 'date' | 'number';
    label: string;
    placeholder?: string;
}

const editState = ref<Record<string, any>>({});

watch(() => props.defaultValues, newValue => {
    editState.value = { ...newValue };
}, { immediate: true });

function invDelete() {
    if (props.deleteFn && confirm('Are you sure you want to delete this?')) {
        props.deleteFn({ where: props.where }).then().catch(error => {
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
    });
}
</script>

<style scoped lang="scss">
.editors-dashboard {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 64px;

    &--top-control {
        display: flex;
        justify-content: end;
    }

    &--control {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    &--item-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: start;
        justify-content: center;

        padding: 16px;
        border-radius: 8px;

        background: $darkgray850;

        &-controls {
            display: flex;
            flex-direction: row;
            gap: 8px;
            justify-content: end;
        }

        &-empty {
            text-align: center;
        }
    }
}
</style>
