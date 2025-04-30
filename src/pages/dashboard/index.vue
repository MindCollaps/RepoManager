<template>
    <div class="dashboard">
        <div class="dashboard-side">
            <div class="dashboard-side-nav">
                <common-button
                    v-for="(d, i) in dashboard"
                    :key="i"
                    :type="activeId === i ? 'primary' : 'transparent'"
                    @click="selectMenu(i)"
                >
                    <template #default>
                        {{ d.title }}
                    </template>
                    <template
                        v-if="d.icon"
                        #icon
                    >
                        <component :is="d.icon"/>
                    </template>
                </common-button>
            </div>
            <div class="dashboard-side-menu">
                <view-login/>
            </div>
        </div>
        <template v-if="activeId >= 0 && activeId < dashboard.length">
            <div class="dashboard-top-wrap">
                <transition name="title">
                    <div
                        :key="activeId"
                        class="dashboard-top"
                    >
                        <component
                            :is="dashboard[activeId].icon"
                            class="dashboard-top-icon"
                        />{{ dashboard[activeId].title }}
                    </div>
                </transition>
            </div>
        </template>
        <div class="dashboard-topside">
            Repo-Manager
        </div>
        <div class="dashboard-content">
            <transition>
                <component
                    :is="dashboard[activeId].content"
                    v-if="activeId >= 0 && activeId < dashboard.length"
                />
            </transition>
            <common-loader v-if="loading"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import { useStore } from '~/store';
import ViewLogin from '~/components/views/ViewLogin.vue';

definePageMeta({
    middleware: ['authenticated'],
    layout: 'false',
});

const store = useStore();

const router = useRouter();
const route = useRoute();

const loading = ref(true);

const menuNames = ['user', 'group', 'token'];

const dashboard = useDashboard();

const activeId = ref(-1);

function selectMenu(menu: number) {
    activeId.value = menu;

    const menuName = menuNames[menu] || 'user';

    router.replace({
        path: route.path,
        query: { ...route.query, menu: menuName },
    });

    store.navigation = (menuNames[menu] as 'menu' | 'token' | 'user') || 'user';
}

onMounted(() => {
    const menuParam = route.query.menu as string;
    if (menuParam) {
        const idx = menuNames.indexOf(menuParam);
        activeId.value = idx !== -1 ? idx : 0;
    }
    else {
        const idx = menuNames.indexOf(store.navigation);
        selectMenu(idx !== -1 ? idx : 0);
    }

    loading.value = false;
});
</script>

<style scoped lang="scss">
.title-enter-active,
.v-enter-active {
    transition: all 1s ease;
}

.title-enter-from {
    transform: translateX(100px);
    opacity: 0;
}

.v-enter-from {
    transform: translateY(100px);
    opacity: 0;
}

.dashboard {
    display: grid;
    grid-template-columns: [side] 200px [content] auto;
    grid-template-rows: [top] 64px [content] auto;

    min-height: 100vh;
    padding-top: 32px;

    &-side {
        display: flex;
        grid-column: side;
        grid-row: content;
        flex-direction: column;
        gap: 16px;
        justify-content: space-between;

        height: 100%;

        &-nav {
            display: flex;
            flex-direction: column;
            gap: 16px;

            padding-right: 32px;
            padding-left: 32px;
        }

        &-menu {
            background: $darkgray950;
        }
    }

    &-topside {
        grid-column: side;
        grid-row: top;
        padding-left: 32px;
        font-size: 22px;
    }

    &-top {
        display: flex;
        grid-column: content;
        grid-row: top;
        gap: 8px;
        align-items: center;

        width: fit-content;

        &-wrap {
            display: flex;
            justify-content: center;
        }

        &-icon {
            width: 32px;
        }
    }

    &-content {
        overflow: hidden auto;
        grid-column: content;
        grid-row: content;

        padding: 16px;

        background: $darkgray900;
    }
}
</style>
