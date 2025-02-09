export default defineNuxtRouteMiddleware(async (to) => {

    if (to.name == 'index' || to.meta.requiresAuth) return;

    const userStore = useUserStore();
    const isLoggedIn = await userStore.isLoggedIn();
    if (isLoggedIn) {
        return navigateTo({
            path: "/home",
        });
    }
});
