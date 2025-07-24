export default defineNuxtRouteMiddleware(() => {
    const { loggedIn, user } = useUserSession();

    if (!loggedIn.value || !user.value?.isUser) {
        return navigateTo('/login');
    }
});
