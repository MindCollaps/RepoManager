<template>
    <template v-if="ready">
        <div
            v-if="store.user?.hasInstallation"
            class="installation_tag"
        >
            <div class="installation_check"/>
            GitHub instllation ready
        </div>
        <div
            v-else
            class="installation"
        >
            <div class="installation_tag">
                <div class="installation_check installation_check--not"/>
                GitHub installation was not found
            </div>

            <common-button
                href="/forgery/app"
                primary-color="success600"
            >
                <template #default>
                    Install GitHub App
                </template>
                <template #icon>
                    <github-icon/>
                </template>
            </common-button>
        </div>
    </template>
    <div
        v-else
        class="installation_tag"
    >
        <div class="installation_check installation_check--ready"/>
        Checking installation
    </div>
</template>

<script setup lang="ts">
import { useStore } from '~/store';
import GithubIcon from '~/assets/icons/github.svg?component';
import CommonButton from '~/components/common/CommonButton.vue';

const store = useStore();
const ready = ref(false);

onMounted(() => ready.value = true);
</script>

<style scoped lang="scss">
.installation {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &_tag {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
    }

    &_check {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background: $success500;

        &--not {
            background: $error500;
        }

        &--ready {
            background: $warning500;
        }
    }
}
</style>
