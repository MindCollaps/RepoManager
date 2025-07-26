<template>
    <div class="settings">
        <div class="settings-top-control">
            <common-button
                primary-color="error500"
                width="fit-content"
                @click="navigateTo('/dashboard')"
            >
                Back
            </common-button>
        </div>
        <div v-if="gitGroup?.users">
            <div
                v-for="u in gitGroup.users"
                :key="u.user.id"
            >
                <div
                    v-motion
                    class="user-card"
                    :enter="{ opacity: 1, y: 0 }"
                    :initial="{ opacity: 0, y: 30 }"
                    :leave="{ opacity: 0, y: -30 }"
                >
                    <div class="user-card-item">
                        <common-git-profile-pic :override-image="u.user.avatar_url"/> <div class="user-card-item-description">{{ u.user.name }} | {{ u.user.username }} | <common-user-repo-state :state="u.repoState"/></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFindUniqueGitGroup } from '~~/lib/hooks';
import { useRoute } from 'vue-router';

definePageMeta({
    middleware: ['authenticated'],
    layout: 'empty',
});

const route = useRoute();

const groupId = parseInt(route.params.id as string);

const loading = ref(true);

const { data: gitGroup } = useFindUniqueGitGroup({
    where: {
        id: groupId,
    },
    include: { users: { include: { user: true } } },
}, { enabled: true });

onMounted(() => {
    loading.value = false;
});
</script>

<style scoped lang="scss">
.settings {
    display: flex;
    flex-direction: column;
    gap: 24px;

    min-height: 100vh;
    padding: 64px;

    background: linear-gradient(to bottom, varToRgba('darkgray950', 0.5), varToRgba('darkgray900', 0.5));

    &-top-control {
        display: flex;
        justify-content: end;
        margin-bottom: 8px;
    }
}

.user-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: 20px;
    border-radius: 10px;

    background: linear-gradient(135deg, $darkgray875, $darkgray850);
    box-shadow: 0 2px 8px rgb(0, 0, 0, 0.15);

    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &-item {
        display: flex;
        flex-direction: row;
        gap: 32px;
        align-items: center;


        &-description {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgb(0, 0, 0, 0.2);
    }

    &-controls {
        display: flex;
        flex-direction: row;
        gap: 12px;
    }

    &-empty {
        padding: 24px;
        font-style: italic;
        color: $lightgray300;
        text-align: center;
    }
}
</style>
