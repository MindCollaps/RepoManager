<template>
    <div class="dashboard-token">
        <common-popup
            :is-visible="popupVisible"
            @close="closePopup()"
            @submit="createToken()"
        >
            <div class="dashboard-token--popup-content">
                <common-input-text v-model="newToken.name">Name</common-input-text>
                <common-input-text v-model="newToken.token">Token</common-input-text>
                <common-date-picker
                    v-model="newToken.expiryDate"
                >Expiry Date</common-date-picker>
            </div>
        </common-popup>
        <div class="dashboard-token--control">
            <common-button @click="popupVisible = true">
                <template #icon>
                    <add-icon/>
                </template>
            </common-button>
        </div>
        <div class="dashboard-token--tokens-list">
            <div
                v-for="t in tokens"
                :key="t.id"
                class="dashboard-token--tokens-list-item"
            >
                {{ t.name }}
            </div>
            <div
                v-if="tokens?.length === 0"
                class="dashboard-token--tokens-list-item"
            >
                Empty
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonPopup from '~/components/common/CommonPopup.vue';
import CommonButton from '~/components/common/CommonButton.vue';
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import AddIcon from '~/assets/icons/add.svg?component';
import { useCreateGroupInviteToken, useFindManyGroupInviteToken } from '~~/lib/hooks';

const createInviteToken = useCreateGroupInviteToken();
const { session } = useUserSession();
const { data: tokens } = useFindManyGroupInviteToken({
    where: {
        ownerId: session.value.user?.userId,
    },
});

const popupVisible = ref(false);

const defaultToken = {
    name: '',
    token: '',
    maxUse: 1,
    expiryDate: new Date(),
};

const newToken = ref({ ...defaultToken });

function closePopup() {
    popupVisible.value = false;
    newToken.value = { ...defaultToken };
}

async function createToken() {
    await createInviteToken.mutateAsync({
        data: {
            name: newToken.value.name,
            maxUse: newToken.value.maxUse,
            token: newToken.value.token,
            expiryDate: newToken.value.expiryDate,
            group: {
                connect: {
                    id: 0, // TODO: Change that duuuh~
                },
            },
            owner: {
                connect: {
                    id: session.value.user?.userId,
                },
            },
        },
    });
}
</script>

<style scoped lang="scss">
.dashboard-token {
    display: flex;
    flex-direction: column;

    &--control {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    &--tokens-list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        margin-top: 16px;
        padding: 16px;

        background: $darkgray900;

        &-item {
            padding: 16px;
            border-radius: 8px;
            background: $darkgray850;
        }
    }

    &--popup-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
}
</style>
