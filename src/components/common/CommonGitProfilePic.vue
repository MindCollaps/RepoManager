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

defineProps({
    width: {
        required: false,
        default: '64px',
        type: String,
    },
});

const { session } = useUserSession();

const avatarUri = session.value?.avatar_url ?? GithubIcon;
</script>

<style scoped lang="scss">
.git-pb {
    border-radius: 50%;
}
</style>
