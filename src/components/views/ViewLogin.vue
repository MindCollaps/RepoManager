<template>
    <template v-if="ready">
        <common-button
            v-if="!loggedIn || !user?.isUser"
            href="/login"
        >Login</common-button>
        <common-button
            v-else-if="loggedIn"
            href="/profile"
            icon-width="45px"
            type="transparent"
        >
            <template #default>
                <div class="loggedin-view">
                    {{ user?.username }}
                    <div
                        v-if="notifications !== 0"
                        v-motion
                        class="notification-indicator"
                        :enter="{
                            y: [0, -15, 0], // up, then down
                            transition: {
                                type: 'spring',
                                stiffness: 400,
                                damping: 10,
                                repeat: Infinity,
                                repeatDelay: 5000, // seconds
                                duration: 500,
                            },
                        }"
                        :initial="{ y: 0 }"
                    >!</div>
                </div>
            </template>
            <template #icon>
                <common-git-profile-pic width="45px"/>
            </template>
        </common-button>
    </template>
    <template v-else>
        <common-loader smol/>
    </template>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import CommonGitProfilePic from '../common/CommonGitProfilePic.vue';
import { useCountNotification } from '~~/lib/hooks';
import CommonLoader from '../common/CommonLoader.vue';

const ready = ref(false);

const { loggedIn, user } = useUserSession();
const { data: notifications } = useCountNotification({
    where: {
        read: false,
    },
});

onMounted(() => {
    ready.value = true;
});
</script>

<style scoped lang="scss">
.notification-indicator {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 22px;
    height: 22px;
    border-radius: 50%;

    color: $lightgray0;

    background: $warning600;
}

.loggedin-view {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center
}
</style>
