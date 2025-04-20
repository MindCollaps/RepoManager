<template>
    <div class="basic-dashboard">
        <common-popup
            :is-visible="popupVisible"
            @close="closePopup()"
            @submit="$emit('create')"
        >
            <div class="basic-dashboard--popup-content">
                <slot name="popup"/>
            </div>
        </common-popup>
        <div class="basic-dashboard--control">
            <common-button @click="popupVisible = true">
                <template #icon>
                    <add-icon/>
                </template>
            </common-button>
        </div>
        <div class="basic-dashboard--list">
            <div
                v-for="i in fetchedData"
                :key="i.id"
                class="basic-dashboard--list-item"
            >
                <slot
                    :item="i"
                    name="item"
                />
                <div class="basic-dashboard--list-item-controls">
                    <common-button
                        v-if="deletable"
                        primary-color="success500"
                        @click="$emit('edit', i.id)"
                    >
                        <template #icon>
                            <edit-icon/>
                        </template>
                    </common-button>
                    <common-button
                        v-if="deletable"
                        primary-color="error600"
                        @click="$emit('delete', i.id)"
                    >
                        <template #icon>
                            <delete-icon/>
                        </template>
                    </common-button>
                </div>
            </div>
            <div
                v-if="fetchedData?.length === 0"
                class="basic-dashboard--list-item-empty"
            >
                Empty
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="NEW, DB extends { id: number }">
import CommonPopup from '~/components/common/CommonPopup.vue';
import CommonButton from '~/components/common/CommonButton.vue';
import DeleteIcon from '~/assets/icons/delete.svg?component';
import AddIcon from '~/assets/icons/add.svg?component';
import EditIcon from '~/assets/icons/edit.svg?component';
import type { PropType } from 'vue';

const props = defineProps({
    defaultValues: {
        type: Object as PropType<NEW>,
        required: true,
    },
    fetchedData: {
        type: Object as PropType<Array<DB> | undefined>,
        required: true,
    },
    deletable: {
        type: Boolean,
        default: false,
    },
    editable: {
        type: Boolean,
        default: false,
    },
});

defineEmits({
    delete(id: number) {
        return true;
    },
    edit(id: number) {
        return true;
    },
    create() {
        return true;
    },
});

defineSlots<{
    item(props: { item: DB }): any;
    popup(): any;
}>();

const popupVisible = ref(false);

const newValues = ref<NEW | undefined>(undefined);

onMounted(() => {
    newValues.value = { ...props.defaultValues };
});

function closePopup() {
    popupVisible.value = false;
    newValues.value = { ...props.defaultValues };
}
</script>

<style scoped lang="scss">
.basic-dashboard {
    display: flex;
    flex-direction: column;

    &--control {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    &--list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        margin-top: 16px;
        padding: 16px;

        background: $darkgray900;

        &-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            padding: 16px;
            border-radius: 8px;

            background: $darkgray850;

            &-controls {
                display: flex;
                flex-direction: row;
                gap: 8px;
            }

            &-empty {
                text-align: center;
            }
        }
    }

    &--popup-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
}
</style>
