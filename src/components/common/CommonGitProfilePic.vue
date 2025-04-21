<template>
    <nuxt-img
        alt="users profile picture"
        class="git-pb"
        :src="avatarUri"
        :width="width"
    />
</template>

<script setup lang="ts">
import GithubIcon from '~/assets/icons/github.svg';

const props = defineProps({
    width: {
        required: false,
        default: '64px',
        type: String,
    },
    overrideImage: {
        type: String,
    },
});

const { session } = useUserSession();

const avatarUri = shallowRef('');

watch(() => props.overrideImage, newVal => {
    avatarUri.value = newVal ? newVal : session.value?.avatar_url ?? GithubIcon;
}, { immediate: true });
</script>

<style scoped lang="scss">
.git-pb {
    border-radius: 50%;
}
</style>
