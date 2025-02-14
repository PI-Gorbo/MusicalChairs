<template>
    <div class="w-full h-full bg-background">
        <NuxtLayout name="default">
            <div class="flex flex-col h-full">
                <nav class="flex bg-primary items-center px-2 justify-between">
                    <NuxtLink
                        to="/home"
                        class="p-4 text-primary-foreground font-semibold text-lg"
                    >
                        Musical Chairs
                    </NuxtLink>
                    <div
                        v-if="displayMode.isWeb.value"
                        class="flex flex-1 justify-end gap-1 px-28"
                    >
                        <NuxtLink to="/jobs">
                            <Button class="bg-primary-shade text-center">
                                <FontAwesomeIcon :icon="faPersonRunning" />
                                Jobs
                            </Button>
                        </NuxtLink>
                        <NuxtLink to="/drafts">
                            <Button class="bg-primary-shade text-center">
                                <FontAwesomeIcon :icon="faAddressBook" />
                                Drafts
                            </Button>
                        </NuxtLink>
                        <NuxtLink to="/profile">
                            <Button class="bg-primary-shade text-center">
                                <FontAwesomeIcon :icon="faCircleUser" />
                                Your Profile
                            </Button>
                        </NuxtLink>
                    </div>
                    <div class="px-4">
                        <AsyncButton
                            :async="{
                                type: 'Click',
                                label: 'Log Out',
                                loadingLabel: 'Logging Out...',
                                icon: faRightToBracket,
                                click: logout,
                            }"
                        />
                    </div>
                </nav>
                <section class="flex-1 overflow-y-auto">
                    <div class="max-h-full h-full px-2">
                        <NuxtPage />
                    </div>
                </section>
                <footer
                    v-if="displayMode.isMobile.value"
                    class="bg-primary w-full py-1 flex justify-center gap-3 px-2 h-fit"
                >
                    <div class="grid grid-cols-3 grid-rows-1 items-center">
                        <NuxtLink to="/jobs">
                            <Button
                                class="bg-primary shadow-none text-center flex flex-col h-fit p-1"
                            >
                                <div>
                                    <FontAwesomeIcon :icon="faPersonRunning" size="sm"/>
                                </div>
                                <div class="text-sm">Jobs</div>
                            </Button>
                        </NuxtLink>
                        <NuxtLink to="/drafts">
                            <Button
                                class="bg-primary shadow-none text-center flex flex-col h-fit p-1"
                            >
                                <div>
                                    <FontAwesomeIcon :icon="faAddressBook" size="sm"/>
                                </div>
                                <div class="text-sm">Drafts</div>
                            </Button>
                        </NuxtLink>
                        <NuxtLink to="/profile">
                            <Button
                                class="bg-primary shadow-none text-center flex flex-col h-fit p-1"
                            >
                                <div>
                                    <FontAwesomeIcon :icon="faCircleUser" size="sm"/>
                                </div>
                                <div class="text-sm">Your Profile</div>
                            </Button>
                        </NuxtLink>
                    </div>
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
    faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const displayMode = useDisplayMode();
const userStore = useUserStore();

async function logout() {
    await userStore.logout();
}
</script>
