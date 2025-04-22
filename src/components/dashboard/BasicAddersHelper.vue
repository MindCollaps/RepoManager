<template>
    <div class="adder-helper">
        <div
            v-if="label"
            class="adder-helper--label"
        >
            {{ label }}
        </div>
        <div class="adder-helper--list-wrap">
            <div class="adder-helper--list">
                <template
                    v-if="selectedData"
                >
                    <div
                        v-for="selected in selectedData"
                        :key="selected.id"
                        class="adder-helper--list-item"
                    >
                        <div
                            v-for="displaying in factory.display"
                            :key="displaying"
                        >
                            {{ selected[displaying] }}
                        </div>
                    </div>
                </template>
                <div v-if="!selectedData || selectedData?.length === 0">
                    Nothing Selected
                </div>
            </div>
            <common-button
                :primary-color="addVisible ? 'error400' : 'success400'"
                @click="addVisible = !addVisible"
            >
                {{ addVisible ? 'Close' : 'Select' }}
            </common-button>
        </div>
        <transition>
            <div
                v-if="addVisible"
                class="adder-helper--adder-list"
            >
                <template v-if="factory.data">
                    <div
                        v-for="factoryData in factory.data"
                        :key="factoryData.id"
                        class="adder-helper--adder-list-item"
                    >
                        <div  class="adder-helper--adder-list-item-labels">
                            <div
                                v-for="displaying in factory.display"
                                :key="displaying"
                                class="adder-helper--adder-list-item-label"
                            >
                                {{ factoryData[displaying] }}
                            </div>
                        </div>
                        <common-button
                            v-if="selectedDataIds?.findIndex(x => x === factoryData.id) === -1"
                            primary-color="success400"
                            @click="select(factoryData.id)"
                        >
                            Select
                        </common-button>
                        <common-button
                            v-else
                            primary-color="error400"
                            @click="deSelect(factoryData.id)"
                        >
                            Deselect
                        </common-button>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown> & { id: number }">
import type { PropType } from 'vue';
import CommonButton from '../common/CommonButton.vue';

export interface UpdateFactory<T extends Record<string, any>> {
    updateFn: (args: {
        where: { id: number };
        data: Record<string, any>;
    }) => Promise<unknown>;
    data?: T[];
    selected?: number[];
    display: [keyof T];
    updateDataAddConstruct: Record<string, any>;
    updateDataAddKey: string;
    updateDataRemoveConstruct: Record<string, any>;
    updateDataRemoveKey: string;
}

const props = defineProps({
    factory: {
        type: Object as PropType<UpdateFactory<T>>,
        required: true,
    },
    label: {
        type: String,
    },
});

defineSlots<{
    default(props: { item: T }): any;
}>();

const selectedData: ComputedRef<Array<T> | undefined> = computed(() => {
    if (props.factory.selected) {
        return props.factory.data?.filter(
            item => props.factory.selected?.findIndex(sel => sel === item.id) !== -1,
        );
    }
    return [];
});

const selectedDataIds: ComputedRef<Array<number> | undefined> = computed(() => selectedData.value?.map(x => x.id));

const addVisible = ref(false);

const createNestedObject = (path: string, value: any) => {
    return path.split('.').reduceRight((acc, key) => ({ [key]: acc }), value);
};

async function select(id: number) {
    const nestedUpdate = createNestedObject(props.factory.updateDataAddKey, id);

    const data = {
        ...props.factory.updateDataAddConstruct,
        ...nestedUpdate,
    };

    await props.factory.updateFn({
        where: { id },
        data,
    });
}

async function deSelect(id: number) {
    const nestedUpdate = createNestedObject(props.factory.updateDataRemoveKey, id);

    const data = {
        ...props.factory.updateDataRemoveConstruct,
        ...nestedUpdate,
    };

    await props.factory.updateFn({
        where: { id },
        data,
    });
}
</script>

<style scoped lang="scss">
.adder-helper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &--label {
        font-family: $defaultFont;
        font-size: 12px;
        font-weight: 600;
        line-height: 100%;
    }

    &--list {
        display: flex;
        padding: 16px;
        border-radius: 8px;
        background: $darkgray800;

        &-wrap {
            display: flex;
            flex-direction: row;
            gap: 16px;
        }
    }

    &--adder-list {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;

        max-height: 200px;
        padding: 16px;
        border-radius: 8px;

        background: $darkgray950;

        &-item {
            display: flex;
            flex-direction: row;
            gap: 16px;
            align-items: center;
            justify-content: space-between;

            &-labels {
                display: flex;
                display: row;
                gap: 8px;
            }

            &-label {
                &::after {
                    content: '|';
                }
            }

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
