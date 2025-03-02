<template>
    <div class="w-full h-full bg-background">
        <NuxtLayout name="default">
            <div class="flex flex-col h-full relative">
                <nav class="flex bg-primary items-center px-2 justify-between">
                    <NuxtLink
                        to="/app/home"
                        class="p-4 text-primary-foreground font-semibold text-lg"
                    >
                        Musical Chairs
                    </NuxtLink>
                    <div
                        v-if="displayMode.isWeb.value"
                        class="flex flex-1 justify-end gap-1 px-28"
                    >
                        <NuxtLink to="/app/home">
                            <Button class="bg-primary-shade text-center">
                                <FontAwesomeIcon :icon="faPersonRunning" />
                                Jobs
                            </Button>
                        </NuxtLink>
                        <NuxtLink to="/app/drafts">
                            <Button class="bg-primary-shade text-center">
                                <FontAwesomeIcon :icon="faAddressBook" />
                                Drafts
                            </Button>
                        </NuxtLink>
                        <NuxtLink to="/app/profile">
                            <Button class="bg-primary-shade text-center">
                                <FontAwesomeIcon :icon="faCircleUser" />
                                Your Profile
                            </Button>
                        </NuxtLink>
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
                    <Tabs :modelValue="useRoute().path">
                        <TabsList>
                            <TabsTrigger value="/app/home">
                                <NuxtLink to="/app/home">
                                    <FontAwesomeIcon :icon="faHouse" />
                                </NuxtLink>
                            </TabsTrigger>
                            <TabsTrigger value="/app/drafts">
                                <NuxtLink to="/app/drafts">
                                    <FontAwesomeIcon :icon="faAddressBook" />
                                </NuxtLink>
                            </TabsTrigger>
                            <TabsTrigger value="/app/profile">
                                <NuxtLink to="/app/profile">
                                    <FontAwesomeIcon :icon="faCircleUser" />
                                </NuxtLink>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </footer>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {
    faAddressBook,
    faCircleUser,
    faHouse,
    faPersonRunning,
    faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Tabs from "~/components/ui/tabs/Tabs.vue";
import TabsList from "~/components/ui/tabs/TabsList.vue";
import TabsTrigger from "~/components/ui/tabs/TabsTrigger.vue";

const displayMode = useDisplayMode();



</script>
