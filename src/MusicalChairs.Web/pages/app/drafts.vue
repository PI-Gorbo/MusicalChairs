<template>
    <div class="w-full">
        <header class="prose flex justify-between py-2">
            <h3>Your Drafts</h3>
        </header>
        <section >

        </section>
    </div>
</template>
<script setup lang="ts">

definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
</script>
