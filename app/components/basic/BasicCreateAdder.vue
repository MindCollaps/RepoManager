<template>
    <div class="create-helper">
        <div
            v-if="label"
            class="create-adder--label"
        >
            {{ label }}
        </div>
        <div class="create-adder--list-wrap">
            <div v-if="data.length > 0 && selectedData.length > 0">
                {{ selectedData.length }} Selected
            </div>
            <div v-else-if="data?.length === 0">
                Nothing to select
            </div>
            <div v-else>
                Nothing Selected
            </div>
            <common-button
                v-if="data?.length ?? 0 > 0"
                :primary-color="addVisible ? 'error400' : 'success400'"
                @click="addVisible = !addVisible"
            >
                {{ addVisible ? 'Close' : 'Select' }}
            </common-button>
        </div>
        <transition>
            <div
                v-if="addVisible"
                class="create-adder--adder-list"
            >
                <template v-if="data">
                    <div
                        v-for="item in data"
                        :key="item.id"
                        class="create-adder--adder-list-item"
                    >
                        <div class="create-adder--adder-list-item-labels">
                            <slot :item="item"/>
                        </div>
                        <common-button
                            v-if="selectedData?.findIndex(x => x === item.id) === -1"
                            primary-color="success400"
                            @click="select(item.id)"
                        >
                            Select
                        </common-button>
                        <common-button
                            v-else
                            primary-color="error400"
                            @click="deSelect(item.id)"
                        >
                            Deselect
                        </common-button>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts" generic="T extends { id: number }">
import type { PropType } from 'vue';

const props = defineProps({
    data: {
        type: Object as PropType<Array<T>>,
        default: new Array<T>,
    },
    label: {
        type: String,
        required: true,
    },
});

defineSlots<{
    default(props: { item: T }): any;
}>();

const addVisible = ref(false);

const selected = defineModel({ type: Array<number>, required: true });

const selectedData = computed(() => props.data?.filter(
    d => selected.value.findIndex(sel => sel === d.id) !== -1,
).map(x => x.id));

function select(id: number) {
    selected.value.push(id);
}

function deSelect(id: number) {
    selected.value = selected.value.filter(x => x !== id);
}
</script>

<style scoped lang="scss">
.create-adder {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 300px;

    &--label {
        font-family: $defaultFont;
        font-size: 12px;
        font-weight: 600;
        line-height: 100%;
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
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: all 0.5s ease;
}

.v-enter-from {
    transform: translateY(-20px);
    opacity: 0;
}

.v-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>
