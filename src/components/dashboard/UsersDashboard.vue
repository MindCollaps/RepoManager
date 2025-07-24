<template>
    <basic-dashboard
        :default-values="defaultUser"
        deletable
        editable
        :fetched-data="gitUsers"
        @create="createUser()"
        @delete="deleteUser"
        @edit="editUser"
    >
        <template #popup>
            <div
                v-if="newUser.confirmed && newUser.confirmStatus"
                class="git-top"
            >
                <common-git-profile-pic :override-image="newUser.avatar_url"/>
                {{ newUser.username }}
            </div>
            <common-input-text v-model="newUser.name">Clear Name</common-input-text>
            <div
                class="git-user-check"
                :style="getGitStyle"
            >
                <common-input-text
                    v-model="newUser.username"
                    @input="newUser.confirmed = false"
                >
                    Git User Name
                </common-input-text>
                <common-button
                    v-if="!newUser.confirmed"
                    primary-color="success400"
                    @click="checkGit()"
                >Check</common-button>
            </div>
            <common-input-text v-model="newUser.email">Email</common-input-text>
        </template>
        <template #item="{ item }">
            <div class="user-dashboard-item">
                <common-git-profile-pic :override-image="item.avatar_url"/> {{ item.name }} | {{ item.username }}
            </div>
        </template>
    </basic-dashboard>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonGitProfilePic from '../common/CommonGitProfilePic.vue';
import { useFindManyGitUser, useDeleteGitUser } from '~~/lib/hooks';
import BasicDashboard from '../basic/BasicDashboard.vue';

const { data: gitUsers, refetch } = useFindManyGitUser({});
const useDeleteUser = useDeleteGitUser();

const defaultUser = {
    name: '',
    username: '',
    email: '',
    avatar_url: '',
    confirmed: false,
    confirmStatus: false,
};

const newUser = ref({ ...defaultUser });

const getGitStyle = computed(() => {
    if (!newUser.value.confirmed) {
        return {};
    }

    if (newUser.value.confirmStatus) {
        return { 'border-color': colorsList.success600, 'border-style': 'solid' };
    }
    else {
        return { 'border-color': colorsList.error600, 'border-style': 'solid' };
    }
});

async function checkGit() {
    try {
        const { avatar_url } = await $fetch(`/api/v1/gituser?username=${ newUser.value.username }`);
        newUser.value.confirmed = true;
        newUser.value.confirmStatus = true;
        newUser.value.avatar_url = avatar_url;
    }
    catch {
        newUser.value.confirmed = true;
        newUser.value.confirmStatus = false;
    }
}

async function createUser() {
    if (!newUser.value.confirmed) {
        await checkGit();
    }

    if (!newUser.value.confirmed || !newUser.value.confirmStatus) {
        alert('Git Username Invalid!');
        return;
    }

    await $fetch(`/api/v1/gituser`, {
        method: 'POST',
        body: {
            name: newUser.value.name,
            username: newUser.value.username,
            email: newUser.value.email,
        },
    }).then(data => {
        refetch();
    }).catch(error => {
        if (error.statusCode === 400) {
            alert(error.data.data);
        }
        else {
            alert(error.statusMessage);
        }
    });
}

async function deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
        await useDeleteUser.mutateAsync({
            where: {
                id: id,
            },
        });
    }
}

function editUser(id: number) {
    navigateTo(`/dashboard/user-${ id }`);
}
</script>

<style scoped lang="scss">
.user-dashboard-item {
    display: flex;
    flex-direction: row;
    gap: 32px;
    align-items: center;
}

.git {
    &-top {
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: center;

        margin-bottom: 32px;
    }

    &-user-check {
        display: flex;
        flex-direction: column;
        gap: 8px;

        padding: 16px;
        border-radius: 16px;

        background: $darkgray850;
    }
}
</style>
