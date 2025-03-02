<template>
    <div class="py-2 flex justify-end">
        <AsyncButton
            :async="{
                type: 'Click',
                label: 'Log Out',
                loadingLabel: 'Logging Out...',
                icon: faRightFromBracket,
                click: logout,
            }"
            class="shadow-square-sm flex-1"
        />
    </div>
</template>
<script setup lang="ts">
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const userStore = useUserStore();
definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});

async function logout() {
    await userStore.logout();
}
</script>
