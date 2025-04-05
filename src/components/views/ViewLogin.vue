<template>
    <common-button
        v-if="!loggedIn"
        href="/login"
    >Login</common-button>
    <common-button
        v-else
        href="/profile"
        type="transparent"
    >{{ user?.username }}</common-button>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';

const { loggedIn, user } = useUserSession();
</script>
