<template>
    <main class="h-full bg-accent">
        <header>
            <nav class="bg-ms-primary px-2">
                <div class="p-4 text-primary-foreground text-lg">
                    Musical Chairs
                </div>
            </nav>
        </header>
        <article class="h-80 bg-primary flex justify-center items-center">
            <div class="text-primary-foreground flex flex-col gap-2">
                <section>A cool blurb</section>
                <div>
                    <NuxtLink
                        to="/register"
                    >
                        <Button class="bg-ms-accent hover:bg-ms-accent hover:brightness-90">
                            Get Started
                        </Button>
                    </NuxtLink>
                </div>
            </div>
        </article>
        <article >
            
        </article>
    </main>
</template>
<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";

definePageMeta({
    middleware: ['redirect-when-logged-in']
})
</script>
