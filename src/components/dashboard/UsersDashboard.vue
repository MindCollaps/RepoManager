<template>
    <basic-dashboard
        :default-values="defaultUser"
        :fetched-data="gitUsers"
        @create="createUser()"
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
            <common-checkbox v-model="newUser.expires">Expires</common-checkbox>
            <common-date-picker
                v-if="newUser.expires"
                v-model="newUser.expiryDate"
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
import CommonGitProfilePic from '../common/CommonGitProfilePic.vue';
import { useFindManyGitUser } from '~~/lib/hooks';
import BasicDashboard from './BasicDashboard.vue';

const { data: gitUsers } = useFindManyGitUser({});

const popupVisible = ref(false);

const defaultUser = {
    name: '',
    username: '',
    email: '',
    expires: false,
    expiryDate: new Date(),
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

function closePopup() {
    popupVisible.value = false;
    newUser.value = { ...defaultUser };
}

async function createUser() {
    if (!newUser.value.confirmed) {
        await checkGit();
    }

    if (!newUser.value.confirmed || !newUser.value.confirmStatus) {
        alert('Git Username Invalid!');
        return;
    }

    $fetch(`/api/v1/gituser`, {
        method: 'POST',
        body: {
            name: newUser.value.name,
            username: newUser.value.username,
            email: newUser.value.email,
            expires: newUser.value.expires,
            expryDate: newUser.value.expiryDate,
        },
    }).then(data => {
        alert('User created!');
        closePopup();
    }).catch(error => {
        if (error.statusCode === 400) {
            alert(error.data.data);
        }
    });
}
</script>

<style scoped lang="scss">
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
