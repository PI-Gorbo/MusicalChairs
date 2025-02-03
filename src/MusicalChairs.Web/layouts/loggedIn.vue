<template>
    <NuxtLayout name="default">
        <nav class="flex bg-primary items-center px-2">
            <div class="p-4 text-primary-foreground font-semibold text-lg">
                Musical Chairs
            </div>
            <div>
                <AsyncButton
                    :async="{
                        type: 'Click',
                        label: 'Log Out',
                        loadingLabel: 'Logging Out...',
                        click: logout,
                    }"
                />
            </div>
        </nav>
        <div class="px-4">
            <NuxtPage />
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
const userStore = useUserStore()

async function logout() {
    await userStore.logout()
}
</script>
