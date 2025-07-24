<template>
    <nuxt-layout>
        <nuxt-page/>
    </nuxt-layout>
</template>

<script setup lang="ts">
import { provideHooksContext } from '~~/lib/hooks';

provideHooksContext({
    endpoint: '/api/data',
});
</script>
