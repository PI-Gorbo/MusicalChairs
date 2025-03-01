<template>
    <div class="bg-background h-full w-full">
        <header>
            <nav class="flex bg-primary items-center px-2">
                <div class="p-4 text-primary-foreground font-semibold text-lg">
                    Musical Chairs
                </div>
            </nav>
        </header>
        <section class="w-full flex justify-center">
            <article class="max-w-page">
                <div class="prose pt-14 pb-10">
                    <h2 class="mb-0">Welcome to Musical Chairs</h2>
                    <h5>Co-Ordination Platform</h5>
                </div>
                <div class="grid grid-col-1 grid-rows-2">
                    <NuxtLink to="/register">
                        <Button class="w-full"> Sign up for free </Button>
                    </NuxtLink>
                    <NuxtLink to="/login">
                        <div class="text-sm text-muted-foreground">
                            Already got an account? Login instead
                        </div>
                    </NuxtLink>
                </div>
            </article>
        </section>
    </div>
</template>
<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";

useAsyncData(
    "check-logged-in-index",
    async () => {
        const userStore = useUserStore();
        const isLoggedIn = await userStore.isLoggedIn();
        console.log('navigating to home!')
        if (isLoggedIn) {
            return navigateTo({
                path: "/home",
            });
        }
    },
    {
        server: false,
    }
);
</script>