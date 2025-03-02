<template>
    <div class="w-full h-full bg-background">
        <NuxtLayout name="default">
            <div class="flex flex-col h-full relative">
                <nav class="flex bg-primary items-center px-2 justify-between">
                    <NuxtLink to="/app/home" class="p-4 font-semibold prose">
                        <h2 class="text-primary-foreground">Musical Chairs</h2>
                    </NuxtLink>
                    <div
                        v-if="displayMode.isWeb.value"
                        class="flex flex-1 justify-end gap-1"
                    >
                        <AppNavigationTabs />
                    </div>
                </nav>
                <section class="flex-1 overflow-y-auto">
                    <div class="max-h-full h-full px-2">
                        <NuxtPage />
                    </div>
                </section>
                <footer
                    v-if="displayMode.isMobile.value"
                    class="absolute bottom-0 w-full py-4 flex justify-center gap-3 px-2 h-fit"
                >
                    <AppNavigationTabs />
                </footer>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {
    faAddressBook,
    faCircleUser,
    faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AppNavigationTabs from "../components/AppNavigationTabs.vue";

const displayMode = useDisplayMode();
</script>
