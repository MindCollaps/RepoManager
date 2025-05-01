<template>
    <div class="error">
        <p>Login failed</p>
        <nuxt-link href="/login">Try again</nuxt-link>
        <nuxt-link href="/">Go Back</nuxt-link>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'empty',
});

// TODO: read msg parameter and display
</script>

<style scoped lang="scss">
.error {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>
