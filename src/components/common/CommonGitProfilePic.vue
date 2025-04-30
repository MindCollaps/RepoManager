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

const { session } = useUserSession();

const avatarUri = shallowRef('');

watch(() => props.overrideImage, newVal => {
    if (newVal === null) {
        avatarUri.value = GithubIcon;
    }
    else {
        avatarUri.value = newVal ? newVal : session.value?.avatar_url ?? GithubIcon;
    }
}, { immediate: true });
</script>

<style scoped lang="scss">
.git-pb {
    border-radius: 50%;
}
</style>
