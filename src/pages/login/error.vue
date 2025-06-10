<template>
    <div class="error">
        <p v-if="message">{{ message }}</p>
        <p v-else>Login Failed</p>
        <common-button @click="isInstallation ? router.push('/profile') : close()">Try again</common-button>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';

const route = useRoute();
const router = useRouter();

definePageMeta({
    layout: 'empty',
});

const message = ref(route.query.msg as string);
const isInstallation = ref(route.query.install !== undefined);

function close() {
    window.close();
}
</script>

<style scoped lang="scss">
.error {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}
</style>
