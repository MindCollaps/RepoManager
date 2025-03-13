<template>
    <div>
        <h1>{{ error?.statusCode }}</h1>
        <nuxt-link to="/">Go back home</nuxt-link>
    </div>
</template>


<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
    error: Object as () => NuxtError,
});
</script>
