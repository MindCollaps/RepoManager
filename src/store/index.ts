import { defineStore } from 'pinia';
import type { FetchingUser } from '~/types/fetch';

export const useStore = defineStore('index', {
    state: () => ({
        version: '',
        theme: 'default' as ThemesList,
        navigation: 'menu' as 'menu' | 'user' | 'token' & string,
        user: {} as FetchingUser | undefined,
    }),
    actions: {
        async fetchUser() {
            try {
                const userData = await $fetch<FetchingUser>('/api/v1/user');
                this.user = userData ?? {};
            }
            catch (error) {
                console.error('Error fetching user:', error);
            }
        },
    },
});
