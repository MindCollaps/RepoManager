<template>
    <div class="app_content">
        <nuxt-loading-indicator :color="colorsList.primary300"/>
        <slot/>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '~/store';

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

