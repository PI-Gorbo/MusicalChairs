<template>
    <main>
        <template v-if="displayMode.isWeb.value"> </template>
    </main>
</template>
<script setup lang="ts">
const displayMode = useDisplayMode();
</script>
