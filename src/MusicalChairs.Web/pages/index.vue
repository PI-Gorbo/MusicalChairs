<template>
    <div>
        <header>
            <nav class="flex bg-primary items-center px-2">
                <div class="p-4 text-primary-foreground font-semibold text-lg">
                    Musical Chairs
                </div>
                <div class="flex flex-1 justify-end gap-2">
                    <NuxtLink to="/login">
                        <Button variant="secondary"> Log in </Button>
                    </NuxtLink>

                    <NuxtLink to="/register">
                        <Button class="bg-background text-foreground">
                            Sign up for free
                        </Button>
                    </NuxtLink>
                </div>
            </nav>
        </header>
        <article>
            This is the index page, where people that search up musical chairs
            will land.
        </article>
    </div>
</template>
<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";

//@ts-ignore
definePageMeta({
    middleware: ['redirect-when-logged-in']
});
</script>
