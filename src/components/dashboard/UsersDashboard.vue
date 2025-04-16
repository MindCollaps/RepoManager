<template>
    <div class="dashboard-user">
        <common-popup :is-visible="popupVisible">
            <div class="dashboard-user--popup-content">
                <common-input-text v-model="newUser.name">Clear Name</common-input-text>
                <common-input-text v-model="newUser.username">Git User Name</common-input-text>
                <common-checkbox v-model="newUser.expires">Expires</common-checkbox>
                <common-date-picker
                    v-if="newUser.expires"
                    v-model="newUser.expiryDate"
                />
            </div>
        </common-popup>
        <div class="dashboard-user--control">
            <common-button @click="popupVisible = true">
                <template #icon>
                    <add-icon/>
                </template>
            </common-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonPopup from '~/components/common/CommonPopup.vue';
import CommonButton from '~/components/common/CommonButton.vue';
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonCheckbox from '../common/CommonCheckbox.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import AddIcon from '~/assets/icons/add.svg?component';

const popupVisible = ref(false);

const newUser = ref({
    name: '',
    username: '',
    expires: false,
    expiryDate: new Date(),
    avatar_url: '',
});
</script>

<style scoped lang="scss">
.dashboard-user {
    display: flex;
    flex-direction: column;

    &--control {
        display: flex;
        flex-direction: row;

        width: 100%;
    }

    &--popup-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
}
</style>
