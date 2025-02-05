export default defineNuxtRouteMiddleware(async (to) => {

    if (import.meta.server || !to.meta.requiresAuth) return;

    const userStore = useUserStore();
    const isLoggedIn = await userStore.isLoggedIn();
    if (isLoggedIn) {
        return;
    }

    // If the user is not logged in, return them to the 'does not require auth zone'
    return navigateTo({
        path: "/login",
        query: {
            redirectTo: to.path,
        },
    }); 

});
