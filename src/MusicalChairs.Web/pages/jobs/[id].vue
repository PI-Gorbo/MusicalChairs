<template>
    <div>
        {{ route.params.id }}
    </div>
</template>
<script setup lang="ts">
const route = useRoute()
definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
</script>
