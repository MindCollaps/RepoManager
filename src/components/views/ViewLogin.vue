<template>
    <common-button
        v-if="!loggedIn || !user?.isUser"
        href="/login"
    >Login</common-button>
    <common-button
        v-else-if="loggedIn"
        href="/profile"
        icon-width="45px"
        type="transparent"
    >
        <template #default>
            {{ user?.username }}
        </template>
        <template #icon>
            <common-git-profile-pic width="45px"/>
        </template>
    </common-button>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import CommonGitProfilePic from '../common/CommonGitProfilePic.vue';

const { loggedIn, user } = useUserSession();
</script>
