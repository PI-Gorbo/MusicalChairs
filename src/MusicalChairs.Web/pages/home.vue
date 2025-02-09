<template>
    <div class="flex justify-center">
        <div class="max-w-page w-full">
            <section>
                <header class="text-xl font-semibold py-2">Jobs</header>

                <Card>
                    <CardContent
                        class="rounded bg-background"
                        :class="[
                            displayMode.isWeb.value
                                ? 'p-3 grid grid-rows-2 grid-flow-col-dense w-fit overflow-x-auto gap-3'
                                : 'p-0 w-full flex flex-col relative overflow-x-hidden',
                        ]"
                    >
                        <template v-if="displayMode.isMobile.value">
                            <MobileSwipableBar
                                v-for="index in 5"
                                :key="index"
                                :class="[
                                    {
                                        'rounded-t-lg': index == 1,
                                        'rounded-b-lg': index == 5,
                                    },
                                ]"
                            >
                                <template #overlay>Overlay</template>
                                <template #underlay-left>
                                    <Button
                                        class="border-r-lg border-l-0 border-accent h-full"
                                    >
                                        <FontAwesomeIcon :icon="faPencil" />
                                        Edit
                                    </Button>
                                </template>
                            </MobileSwipableBar>
                        </template>
                        <template v-else>
                            <section
                                v-for="index in 5"
                                ref="jobItems"
                                :index="index"
                                :class="['rounded']"
                            >
                                Web
                            </section>
                        </template>
                    </CardContent>
                </Card>
            </section>

            <!-- <section>
                <header class="text-xl font-semibold py-2">
                    Your Draft Jobs
                </header>
                <Card>
                    <CardContent v-for="index in 5" class="py-2 px-4 text-sm">
                        <div>Job Name</div>
                        <div>
                            <FontAwesomeIcon size="sm" :icon="faCheck" />
                            Completed Email
                        </div>
                        <div>
                            <FontAwesomeIcon size="sm" :icon="faX" />
                            Missing Contacts
                        </div>
                    </CardContent>
                </Card>
            </section> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const displayMode = useDisplayMode();

definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
</script>
