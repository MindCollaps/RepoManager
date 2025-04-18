<template>
    <div class="app">
        <div
            class="header"
        >
            <div class="header-text">
                Repo-Manager
            </div>
            <view-menu/>
            <view-login/>
            <view-theme/>
        </div>
        <div class="app_content">
            <nuxt-loading-indicator :color="colorsList.primary300"/>
            <slot/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '~/store';
import ViewMenu from '~/components/views/ViewMenu.vue';
import ViewTheme from '~/components/views/ViewTheme.vue';
import ViewLogin from '~/components/views/ViewLogin.vue';

defineSlots<{ default: () => any }>();

const store = useStore();

const theme = useCookie<ThemesList>('theme', {
    path: '/',
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 360,
});

store.theme = theme.value ?? 'default';

useHead(() => {
    const theme = store.theme ?? 'default';
    const css = Object
        .entries({
            ...pageColors,
            ...(theme === 'default' ? {} : pageThemes[theme]),
        })
        .filter(([key]) => key.endsWith('Rgb'))
        .map(([key, value]) => `--${ key.replace('Rgb', '') }: ${ (value as number[]).join(',') }`)
        .join(';');

    return {
        titleTemplate(title) {
            if (!title) return 'Repo-Manager';
            return `${ title } | Repo-Manager`;
        },
        meta: [
            {
                name: 'description',
                content: '',
            },
        ],
        htmlAttrs: {
            lang: 'en',
            class: [`theme-${ store.theme ?? 'default' }`],
        },
        style: [{
            key: 'pageStyles',
            innerHTML: `:root {${ css }}`,
        }],
        link: [
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com',
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&family=Roboto:ital,wdth,wght@0,75..100,100..900;1,75..100,100..900&display=swap',
            },
        ],
    };
});
</script>

<style scoped lang="scss">
.header {
    position: sticky;

    display: grid;
    grid-template-columns: 0.5fr 2fr 0.3fr 0.3fr;
    gap: 12px;
    align-items: center;

    width: 100%;
    padding: 9px;

    background: $darkgray1000;

    &-text {
        display: flex;
        align-items: center;
        justify-content: start;

        margin-left: 24px;

        font-size: 24px;
    }

    &-container {
        display: flex;
        gap: 100px;
        align-items: center;
    }
}
</style>

<style lang="scss">
html, body {
    width: 100%;
    min-height: 100%;
    margin: 0;
    padding: 0;

    font-family: "Noto Sans", sans-serif;
    font-variation-settings:
    "wdth" 100;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    color: $lightgray150;
    text-size-adjust: 100%;

    background: $darkgray950;
}

svg {
    fill: $lightgray150;
}

*,
*::before,
*::after {
    scrollbar-color: $darkgray800 var(--bg-color, $darkgray1000);
    scrollbar-width: thin;
    box-sizing: border-box;
}
</style>
