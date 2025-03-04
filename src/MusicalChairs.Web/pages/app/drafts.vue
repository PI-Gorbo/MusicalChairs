<template>
    <div class="relative w-full h-full">
        <header class="prose flex justify-between py-2">
            <h3>Your Drafts</h3>
        </header>
        <AsyncButton
            class="absolute bottom-2 right-0"
            :async="{
                type: 'Click',
                label: 'Create Draft',
                icon: faPlus,
                loadingLabel: 'Creating...',
            }"
        />
    </div>
</template>
<script setup lang="ts">
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
</script>
