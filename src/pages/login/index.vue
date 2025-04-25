<template>
    <div class="login">
        <h1 v-if="isLoggedinUser">Welcome {{ user?.username }}!</h1>
        <h2 v-else>Login and give Access</h2>
        <common-button
            href="/"
        >
            <template #default>
                Home
            </template>
            <template #icon>
                <home-icon/>
            </template>
        </common-button>
        <common-button
            v-if="isLoggedinUser"
            type="secondary-875"
            width="128px"
            @click="clear"
        >Logout</common-button>
        <common-button
            v-else
            type="secondary"
            width="256px"
            @click="openInPopup('/auth/github')"
        >
            <template #default>
                Login with GitHub
            </template>
            <template #icon>
                <github-icon/>
            </template>
        </common-button>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import GithubIcon from '/assets/icons/github.svg?component';
import HomeIcon from 'assets/icons/home.svg?component';

const { loggedIn, user, clear, openInPopup } = useUserSession();

const wasLoggedIn = ref(loggedIn.value);

const isLoggedinUser = computed(() => loggedIn && user.value?.userId);

watch(loggedIn, () => {
    if (!wasLoggedIn.value) {
        if (wasLoggedIn.value !== loggedIn.value) {
            navigateTo('/dashboard');
        }
    }
});

definePageMeta({
    layout: false,
});
</script>

<style scoped lang="scss">
.login {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
}
</style>
