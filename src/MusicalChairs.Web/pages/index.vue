<template>
    <div>
        <header>
            <nav class="flex bg-primary items-center px-2">
                <div class="p-4 text-primary-foreground font-semibold text-lg">
                    Musical Chairs
                </div>
            </nav>
        </header>
        <section class="w-full flex justify-center">
            <article class="max-w-[1080px]">
                <h1 >Welcome to Musical Chairs</h1>
                <h3>Co-Ordination Platform</h3>
                <NuxtLink to="/login">
                    <Button variant="secondary"> Log in </Button>
                </NuxtLink>
                <NuxtLink to="/register">
                    <Button class="bg-background text-foreground">
                        Sign up for free
                    </Button>
                </NuxtLink>
            </article>
        </section>
    </div>
</template>
<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";

const checkLoggedIn = useAsyncData(
    "check-logged-in-index",
    async () => {
        const userStore = useUserStore();
        const isLoggedIn = await userStore.isLoggedIn();
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
