<template>
    <main class="w-[100dvw] h-[100dvh]">
        <slot />
        <Dialog :open="appState.hasError">
            <DialogContent>
                <DialogHeader class="header">
                    <DialogTitle>An Error has occurred...</DialogTitle>
                </DialogHeader>
                Something went wrong! We are sorry for the inconvenience. Please
                reload the page and try again.
                <Button variant="destructive" @click="reloadPage">
                    Reload
                </Button>
            </DialogContent>
        </Dialog>
        <Toaster class="pointer-events-auto"/>
    </main>
</template>

<script setup lang="ts">
import { Toaster } from "vue-sonner";

const appState = useAppStateStore();
function reloadPage() {
    window.location.reload();
}
</script>
