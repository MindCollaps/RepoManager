<template>
    <nuxt-img
        alt="users profile picture"
        class="git-pb"
        :src="avatarUri"
        :width="width"
    />
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import GithubIcon from '~/assets/icons/github.svg';
import { useStore } from '~/store';

const props = defineProps({
    width: {
        required: false,
        default: '64px',
        type: String,
    },
    overrideImage: {
        type: String as PropType<string | undefined | null>,
    },
});

const store = useStore();

const avatarUri = computed(() => props.overrideImage ?? store.user?.avatar_url ?? GithubIcon);
</script>

<style scoped lang="scss">
.git-pb {
    border-radius: 50%;
}
</style>
