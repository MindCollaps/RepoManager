import type { User } from '@zenstackhq/runtime/models';
import { defineStore } from 'pinia';
import { useFindUniqueUser } from '~~/lib/hooks';
import type { ThemesList } from '~/utils/styles';

export const useStore = defineStore('index', {
    state: () => ({
        version: '',
        theme: 'default' as ThemesList,
        navigation: 'menu' as 'menu' | 'user' | 'token' & string,
        user: undefined as User | undefined,
    }),
    actions: {
        async fetchUser() {
            const { loggedIn, user } = useUserSession();
            if (loggedIn.value) {
                try {
                    const { data: userData, refetch } = useFindUniqueUser({
                        where: {
                            id: user.value?.userId,
                        },
                    });

                    await refetch();

                    this.user = userData.value;
                    console.log(userData.value);
                }
                catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        },
    },
});
