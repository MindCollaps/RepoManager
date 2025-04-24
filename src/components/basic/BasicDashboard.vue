<template>
    <div class="basic-dashboard">
        <common-popup
            :is-visible="popupVisible"
            @close="closePopup()"
            @submit="create()"
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
                v-motion
                class="basic-dashboard--list-item"
                :enter="{ opacity: 1, y: 0 }"
                :initial="{ opacity: 0, y: 30 }"
                :leave="{ opacity: 0, y: -30 }"
            >
                <slot
                    :item="i"
                    name="item"
                />
                <div class="basic-dashboard--list-item-controls">
                    <slot
                        :item="i"
                        name="action"
                    />
                    <common-button
                        v-if="editable"
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
        type: Object as PropType<Array<DB>>,
    },
    deletable: {
        type: Boolean,
        default: false,
    },
    editable: {
        type: Boolean,
        default: false,
    },
    showPopup: {
        type: Boolean,
    },
});

const emit = defineEmits({
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
    action(props: { item: DB }): any;
}>();

const popupVisible = ref(false);

const newValues = ref<NEW | undefined>(undefined);

watch(
    () => props.defaultValues,
    newVal => {
        newValues.value = { ...newVal };
    },
    { immediate: true },
);

function closePopup() {
    popupVisible.value = false;
    newValues.value = props.defaultValues;
}

function create() {
    emit('create');
}

// TODO: Fix this
onMounted(() => watch([props.showPopup], () => {
    if (props.showPopup) {
        popupVisible.value = true;
    }
    else {
        closePopup();
    }
}));
</script>

<style scoped lang="scss">
.basic-dashboard {
    display: flex;
    flex-direction: column;

    &--control {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        width: 100%;
        margin-bottom: 8px;
    }

    &--list {
        display: flex;
        flex-direction: column;
        gap: 20px;

        margin-top: 20px;
        padding: 24px;
        border-radius: 12px;

        background: linear-gradient(to bottom, $darkgray950, $darkgray900);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        &-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            padding: 20px;
            border-radius: 10px;

            background: linear-gradient(135deg, $darkgray875, $darkgray850);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

            transition: transform 0.2s ease, box-shadow 0.2s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            &-controls {
                display: flex;
                flex-direction: row;
                gap: 12px;
            }

            &-empty {
                padding: 24px;
                font-style: italic;
                color: $lightgray300;
                text-align: center;
            }
        }
    }

    &--popup-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 8px 4px;
    }
}
</style>
