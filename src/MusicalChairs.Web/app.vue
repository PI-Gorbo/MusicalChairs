<template>
    <NuxtLoadingIndicator />
    <NuxtPwaManifest />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
<script setup lang="ts"></script>
<style>
.slide-enter-active {
    transition: all 0.5s;
    position: relative;
}

.slide-leave-active {
    transition: all 0.5s;
    position: relative;
}

.slide-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
