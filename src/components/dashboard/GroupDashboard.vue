<template>
    <div class="dashboard-group">
        <common-popup
            :is-visible="popupVisible"
            @close="closePopup()"
            @submit="createGroup()"
        >
            <div class="dashboard-group--popup-content">
                <common-input-text v-model="newGroup.groupName">Group Name</common-input-text>
                <common-input-text v-model="newGroup.repoName">Repository Name</common-input-text>
                <common-checkbox v-model="newGroup.ownRepo">Own Repo</common-checkbox>
                <common-input-text
                    v-if="!newGroup.ownRepo"
                    v-model="newGroup.repoOwner"
                >Repository Owner</common-input-text>
                <common-checkbox v-model="newGroup.deleteUsers">Delete Users</common-checkbox>
                <common-checkbox v-model="newGroup.deleteSelf">Delete Self</common-checkbox>
                <common-checkbox v-model="newGroup.expires">Expires</common-checkbox>
                <common-date-picker
                    v-if="newGroup.expires"
                    v-model="newGroup.expiryDate"
                />
            </div>
        </common-popup>
        <div class="dashboard-group--control">
            <common-button @click="popupVisible = true">
                <template #icon>
                    <add-icon/>
                </template>
            </common-button>
        </div>
        <div class="dashboard-group--groups-list">
            <div
                v-for="g in gitGroups"
                :key="g.id"
                class="dashboard-group--groups-list-item"
            >
                {{ g.name }}
            </div>
            <div
                v-if="gitGroups?.length === 0"
                class="dashboard-group--groups-list-item"
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
import CommonCheckbox from '../common/CommonCheckbox.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import AddIcon from '~/assets/icons/add.svg?component';
import { useCreateGitGroup, useFindManyGitGroup } from '~~/lib/hooks';

const createGitGroup = useCreateGitGroup();
const { data: gitGroups } = useFindManyGitGroup({});

const { session } = useUserSession();

const popupVisible = ref(false);

const defaultGroup = {
    expires: false,
    expiryDate: new Date(),
    deleteUsers: true,
    deleteSelf: true,
    repoOwner: session.value.user?.username ?? '',
    ownRepo: session.value.user ? true : false,
    repoName: '',
    userId: session.value.user?.userId,
    groupName: '',
};

const newGroup = ref({ ...defaultGroup });

function closePopup() {
    popupVisible.value = false;
    newGroup.value = { ...defaultGroup };
}

async function createGroup() {
    try {
        await createGitGroup.mutateAsync({
            data: {
                expires: newGroup.value.expires,
                expiryDate: newGroup.value.expiryDate,
                deleteUsers: newGroup.value.deleteUsers,
                deleteSelf: newGroup.value.deleteSelf,
                repoOwner: newGroup.value.repoOwner,
                repoName: newGroup.value.repoName,
                name: newGroup.value.groupName,
                owner: {
                    connect: {
                        id: session.value.user?.userId,
                    },
                },
            },
        });
    }
    catch (error) {
        alert('An error occured');
        console.log(error);
        return;
    }

    alert('Group created!');
    closePopup();
}
</script>

<style scoped lang="scss">
.dashboard-group {
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

    &--groups-list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        margin-top: 16px;
        padding :16px;

        background: $darkgray900;

        &-item {
            padding: 16px;
            border-radius: 8px;
            background: $darkgray850;
        }
    }
}
</style>
