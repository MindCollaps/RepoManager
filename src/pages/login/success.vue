<template>
    <p>Success!</p>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'empty',
});

onMounted(() => {
    window.close();
});
</script>
