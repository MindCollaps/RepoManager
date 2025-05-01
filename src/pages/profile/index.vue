<template>
    <div
        v-if="loggedIn"
        class="profile"
    >
        <div class="profile-hello">
            <common-git-profile-pic width="128px"/>
            <h1>Welcome {{ user?.username }}</h1>
        </div>
        <common-button
            href="/dashboard"
        >
            <template #default>
                Dashboard
            </template>
            <template #icon>
                <home-icon/>
            </template>
        </common-button>
        <view-theme/>
        <common-button
            type="secondary"
            width="128px"
            @click="clear"
        >Logout</common-button>
    </div>
    <div
        v-else
        class="profile"
    >
        <h1>You are not logged in!</h1>
        <common-button
            href="/login"
            width="128px"
        >Login</common-button>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import CommonGitProfilePic from '~/components/common/CommonGitProfilePic.vue';
import HomeIcon from '~/assets/icons/home.svg?component';
import ViewTheme from '~/components/views/ViewTheme.vue';

const { loggedIn, user, clear } = useUserSession();

definePageMeta({
    layout: 'empty',
    middleware: ['authenticated'],
});
</script>

<style scoped lang="scss">
.profile {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    margin-top: 32px;

    &-hello {
        display: flex;
        flex-direction: row;
        gap: 32px;
        align-items: center;
    }
}
</style>
