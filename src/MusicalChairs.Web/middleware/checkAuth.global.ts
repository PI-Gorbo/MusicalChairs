export default defineNuxtRouteMiddleware(async (to) => {

    if (import.meta.server) return;

    if (to.meta.requiresAuth) {
        const userStore = useUserStore();
        const isLoggedIn = await userStore.isLoggedIn();
        // If the user is not logged in, return them to the 'does not require auth zone'
        if (!isLoggedIn) {
            console.log("nvaigating to login...")
            return navigateTo({
                path: "/login",
                query: {
                    redirectTo: to.path,
                },
            });
        }
    }


    return;
});
