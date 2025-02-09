<template>
    <main class="bg-background w-[100dvw] h-[100dvh]">
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
    </main>
</template>

<script setup lang="ts">
const appState = useAppStateStore();
function reloadPage() {
    window.location.reload();
}
</script>
