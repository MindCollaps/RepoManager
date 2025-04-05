<template>
    <div>
        <common-button>Lets see</common-button>
        <p>{{ data }}</p>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';

const { data } = await useFetch('/api/v1/gh');
</script>
