<template>
    <div class="time-picker">
        <div class="time-picker-container">
            <div
                v-if="$slots.default"
                class="time-picker_label"
            >
                <slot/>
            </div>
            <common-button
                type="secondary-flat"
                @click="adjustTime(-30)"
            >
                -
            </common-button>
            <common-input-text
                input-type="datetime-local"
                :model-value="formattedStartDate"
                @input="updateStartDate"
            />
            <common-button
                type="secondary-flat"
                @click="adjustTime(30)"
            >
                +
            </common-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonButton from '~/components/common/CommonButton.vue';

defineSlots<{ default?: () => string }>();

const date = defineModel<Date>({ required: true });

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${ year }-${ month }-${ day }T${ hours }:${ minutes }`;
};
const formattedStartDate = computed(() => formatDate(date.value));

const updateStartDate = (event: Event) => {
    const target = event.target as HTMLInputElement;
    date.value = new Date(target.value);
};

const adjustTime = (minutes: number) => {
    const newDate = new Date(date.value.getTime() + (minutes * 60000));
    date.value = newDate;
};
</script>

<style scoped lang="scss">
.time-picker {
    display: flex;
    flex-direction: row;
    gap: 5%;
    align-items: center;
    justify-content: center;

    width: 100%;

    &_label {
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
    }

    &-container {
        display: flex;
        gap: 5px;
        align-items: center;
        justify-content: center;
    }

    &-between {
        font-size: 50px;
    }
}
</style>
