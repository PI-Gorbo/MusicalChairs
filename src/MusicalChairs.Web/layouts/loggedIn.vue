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
                    <div
                        class="max-h-full h-full px-2"
                        v-if="fetchingJobStore.status.value === 'success'"
                    >
                        <NuxtPage />
                    </div>
                    <div
                        v-else
                        class="max-h-full h-full flex items-center justify-center px-2"
                    >
                        <FontAwesomeIcon :icon="faSpinner" class="fa-spin" />
                    </div>
                </section>
                <footer v-if="displayMode.isMobile.value" class="w-full">
                    <AppNavigationTabs />
                </footer>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AppNavigationTabs from "../components/AppNavigationTabs.vue";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const displayMode = useDisplayMode();
const jobStore = useJobStore();
const fetchingJobStore = useAsyncData("init-job-store", async () =>
    jobStore.refresh().then(() => true)
);
</script>
