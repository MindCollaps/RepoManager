<template>
    <div class="login">
        <h1 v-if="loggedIn">Welcome {{ store.user?.username }}!</h1>
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
            v-if="loggedIn"
            type="secondary-875"
            width="128px"
            @click="clear"
        >Logout</common-button>
        <common-button
            v-else
            type="secondary"
            width="256px"
            @click="login()"
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
import { useStore } from '~/store';
import { openInPopup } from '~/composables/frontend';

const store = useStore();

const { loggedIn, clear, fetch } = useUserSession();

watch(loggedIn, () => {
    if (loggedIn.value) {
        window.location.replace('/dashboard');
    }
});

definePageMeta({
    layout: 'empty',
});

async function login() {
    openInPopup('/forgery/github');
    checkLoginState();
}

function checkLoginState() {
    setTimeout(() => {
        fetch();
        if (!loggedIn.value) {
            checkLoginState();
        }
    }, 1000);
}
</script>

<style scoped lang="scss">
.login {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
}
</style>
