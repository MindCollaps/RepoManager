<template>
    <div class="app_content">
        <nuxt-loading-indicator :color="colorsList.primary300"/>
        <slot/>
    </div>
</template>

<script setup lang="ts">
import { colorsList } from '~/utils/styles';
import { useLayout } from '~/composables/layout';

defineSlots<{ default: () => any }>();

useLayout();
</script>

<style lang="scss">
@use "~/scss/layout";
</style>
