<template>
    <basic-dashboard
        :default-values="defaultGroup"
        :fetched-data="gitGroups"
        @create="createGroup()"
    >
        <template #popup>
            <common-input-text v-model="newGroup.groupName">Group Name</common-input-text>
            <div class="git-repo-check">
                <common-input-text
                    v-model="newGroup.repoName"
                    @input="newGroup.confirmed = false"
                >Repository
                    Name</common-input-text>
                <common-button
                    v-if="!newGroup.confirmed"
                    primary-color="success400"
                    @click="checkGit()"
                >Check</common-button>
            </div>
            <common-checkbox v-model="newGroup.ownRepo">Own Repo</common-checkbox>
            <common-input-text
                v-if="!newGroup.ownRepo"
                v-model="newGroup.repoOwner"
            >Repository
                Owner</common-input-text>
            <common-checkbox v-model="newGroup.deleteUsers">Delete Users</common-checkbox>
            <common-checkbox v-model="newGroup.deleteSelf">Delete Self</common-checkbox>
            <common-checkbox v-model="newGroup.expires">Expires</common-checkbox>
            <common-date-picker
                v-if="newGroup.expires"
                v-model="newGroup.expiryDate"
            />
        </template>
        <template #item="{ item }">
            {{ item.name }}
        </template>
    </basic-dashboard>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonCheckbox from '../common/CommonCheckbox.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import { useCreateGitGroup, useFindManyGitGroup } from '~~/lib/hooks';
import BasicDashboard from './BasicDashboard.vue';

const createGitGroup = useCreateGitGroup();
const { data: gitGroups } = useFindManyGitGroup({});

const { session } = useUserSession();

const defaultGroup = {
    expires: false,
    expiryDate: new Date(),
    deleteUsers: true,
    deleteSelf: true,
    repoOwner: session.value?.user?.username ?? '',
    ownRepo: session.value?.user ? true : false,
    repoName: '',
    userId: session.value?.user?.userId,
    groupName: '',
    confirmed: false,
    confirmStatus: false,
};

const newGroup = ref({ ...defaultGroup });

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
                        id: session.value?.user?.userId,
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
}

async function checkGit() {
    try {
        const owner = newGroup.value.repoOwner === '' ? '' : `&owner=${ encodeURIComponent(newGroup.value.repoOwner) }`;
        await $fetch(`/api/v1/gh/repo?name=${ encodeURIComponent(newGroup.value.repoName) + owner }`);
        newGroup.value.confirmed = true;
        newGroup.value.confirmStatus = true;
    }
    catch {
        newGroup.value.confirmed = true;
        newGroup.value.confirmStatus = false;
    }
}
</script>

<style scoped lang="scss">
.git-repo-check {
    display: flex;
    flex-direction: column;
    gap: 8px;

    padding: 16px;
    border-radius: 16px;

    background: $darkgray850;
}
</style>
