export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return;
    if (to.meta.requiresAuth) return;

    const userStore = useUserStore();
    const isLoggedIn = await userStore.isLoggedIn();
    if (isLoggedIn) {
        return navigateTo({
            path: "/app/home",
        });
    }
});
