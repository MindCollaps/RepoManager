<template>
    <div class="dashboard">
        <div class="dashboard-side">
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
        <template v-if="activeId >= 0 && activeId < dashboard.length">
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
        </template>
        <div class="dashboard-topside"/>
        <div class="dashboard-content">
            <transition>
                <component
                    :is="dashboard[activeId].content"
                    v-if="activeId >= 0 && activeId < dashboard.length"
                />
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';

definePageMeta({
    middleware: ['authenticated'],
});

const router = useRouter();
const route = useRoute();

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
}

onMounted(() => {
    const menuParam = route.query.menu as string | undefined;
    if (menuParam) {
        const idx = menuNames.indexOf(menuParam);
        activeId.value = idx !== -1 ? idx : 0;
    }
    else {
        selectMenu(0);
    }
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
    grid-template-columns: [side] 164px [content] auto;
    grid-template-rows: [top] 64px [content] auto;

    min-height: 80vh;
    padding: 32px;

    background: $darkgray900;

    &-side {
        display: flex;
        grid-column: side;
        grid-row: content;
        flex-direction: column;
        gap: 16px;

        padding-right: 32px;
    }

    &-topside {
        grid-column: side;
        grid-row: top;
        font-size: 22px;
    }

    &-top {
        display: flex;
        grid-column: content;
        grid-row: top;
        gap: 8px;
        align-items: center;
        justify-content: center;

        &-icon {
            width: 32px;
        }
    }

    &-content {
        grid-column: content;
        grid-row: content;
        background: $darkgray850;
    }
}
</style>
