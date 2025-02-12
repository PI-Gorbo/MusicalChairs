<template>
    <div class="relative">
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
                <div class="flex justify-between">
                    <NuxtLink to="/register">
                        <Button> Sign up for free </Button>
                    </NuxtLink>
                    <NuxtLink to="/login">
                        <Button class="bg-accent hover:brightness-95">
                            Log in
                        </Button>
                    </NuxtLink>
                </div>
            </article>
        </section>
    </div>
</template>
<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import { definePageMeta } from "../.nuxt/typed-router/__definePageMeta";

definePageMeta({
    layoutTransition: {
        name: "index-to-auth",
        
    },
});

useAsyncData(
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

<style lang="css" scoped>
.index-to-auth-enter-active,
.index-to-auth-leave-active {
    position: relative;
}

.index-to-auth-enter-from::after,
.index-to-auth-leave-to::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--primary);
    transform: translateY(100%);
    transition: transform 0.4s ease-in-out;
}

.index-to-auth-enter-active::after {
    transform: translateY(0);
}

.index-to-auth-leave-active {
    opacity: 1;
    transition: opacity 0.4s ease-in-out;
}

.index-to-auth-leave-to {
    opacity: 0;
}
</style>
