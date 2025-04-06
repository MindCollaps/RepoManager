<template>
    <div class="dashboard">
        <div class="dashboard-side">
            <common-button
                v-for="(d, i) in dashboard"
                :key="i"
                :type="activeId === i ? 'primary' : 'transparent'"
                @click="activeId = i"
            >{{ d.title }}</common-button>
        </div>
        <div class="dashboard-top">
            <template v-if="activeId >= 0 && activeId < dashboard.length">{{ dashboard[activeId].title }}</template>
        </div>
        <div class="dashboard-topside">
            Repo-Manager
        </div>
        <div class="dashboard-content">
            <component
                :is="dashboard[activeId].content"
                v-if="activeId >= 0 && activeId < dashboard.length"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';

const dashboard = useDashboard();

const activeId = ref(-1);
</script>

<style scoped lang="scss">
.dashboard {
    display: grid;
    grid-template-columns: [side] 128px [content] auto;
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
    }

    &-top {
        display: flex;
        grid-column: content;
        grid-row: top;
        align-items: center;
        justify-content: center;
    }

    &-content {
        grid-column: content;
        grid-row: content;
        background: $darkgray850;
    }
}
</style>
