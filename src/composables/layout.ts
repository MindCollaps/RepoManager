import { useStore } from '~/store';

export const useLayout = () => {
    const store = useStore();

    const { loggedIn } = useUserSession();

    // Theme handling
    const themeCookie = useCookie<ThemesList>('theme', {
        path: '/',
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 360,
    });

    // Reactive theme reference
    store.theme = themeCookie.value ?? 'default';

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

    onMounted(() => {
        watch(loggedIn, newValue => {
            if (newValue) {
                store.fetchUser();
            }
            else {
                store.user = undefined;
            }
        }, { immediate: true });
    });
};
