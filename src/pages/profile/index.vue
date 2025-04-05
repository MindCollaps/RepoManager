<template>
    <div v-if="loggedIn">
        <h1>Welcome {{ user?.username }}</h1>
        <ul>
            <li>Email: {{ user?.email }}</li>
        </ul>
        <common-button
            width="128px"
            @click="clear"
        >Logout</common-button>
    </div>
    <div v-else>
        <h1>You are not logged in!</h1>
        <common-button
            href="/login"
            width="128px"
        >Login</common-button>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';

const { loggedIn, user, clear } = useUserSession();
</script>
