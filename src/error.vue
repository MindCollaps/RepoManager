<template>
    <div class="error-root">
        <h1>Error {{ error?.statusCode }}</h1>
        <h2>{{ error?.message }}</h2>
        <div class="error-button">
            <common-button
                width="140px"
                @click="handleError"
            >Back Home</common-button>
        </div>

        <common-button @click="show = !show" width="140px" type="transparent">{{ show ? 'Hide Details' : 'Show Detials' }}</common-button>
        <div v-if="show" class="error">
            <div>
                Cause
                <p>{{ error?.cause ?? 'undefined' }}</p>
            </div>
            <div>
                Data
                <p>{{ error?.data ?? 'undefined' }}</p>
            </div>
            <div>
                Stack
                <p>{{ error?.stack ?? 'undefined' }}</p>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import type { NuxtError } from '#app';
import CommonButton from '~/components/common/CommonButton.vue';

defineProps({
    error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: '/' });

const show = ref(false);
</script>

<style scoped lang="scss">
.error {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    justify-content: center;

    margin-top: 32px;
    padding: 16px;
    border-radius: 16px;

    background: $darkgray900;

    &-button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 32px;
    }

    &-root {
        padding: 32px;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: start;
        width: 100%;
    }

    p {
        background: $darkgray800;
        padding: 16px;
        border-radius: 8px;
    }
}
</style>
