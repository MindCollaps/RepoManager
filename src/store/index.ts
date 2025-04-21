import { defineStore } from 'pinia';

export const useStore = defineStore('index', {
    state: () => ({
        version: '',
        theme: 'default' as ThemesList,
        navigation: 'menu' as 'menu' | 'user' | 'token' & string,
    }),
});
