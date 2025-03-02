<template>
    <div class="flex justify-center w-full h-full">
        <div class="max-w-page w-full">
            <section>
                <header class="prose"><h3>Actve Jobs</h3></header>
                <div
                    v-if="displayMode.isMobile.value"
                    class="flex flex-col bg-background-surface divide-y divide-muted-foreground *:py-2 *:px-1"
                >
                    <template v-for="index in 10">
                        <article v-ripple class="flex items-center">
                            <div class="prose flex-1 select-none">
                                <h5>Fringe Festival</h5>
                                <div
                                    class="prose-sm flex *:px-2 divide-x divide-muted-foreground"
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            :icon="faCheck"
                                            class="text-primary"
                                        />
                                        Tenor (1/1)
                                    </div>
                                    <div class="text-wrap">
                                        <FontAwesomeIcon
                                            :icon="faExclamationCircle"
                                            shake
                                            class="text-secondary"
                                        />
                                        Soprano (0/1) - Confirm Required
                                    </div>
                                </div>
                            </div>
                            <FontAwesomeIcon
                                :icon="faChevronRight"
                                class="text-muted-foreground"
                            />
                        </article>
                        <article v-ripple class="flex items-center">
                            <div class="prose flex-1 select-none">
                                <h5>Cover for Mg'Gaths Churth 25th May</h5>
                                <div
                                    class="prose-sm flex *:px-2 divide-x divide-muted-foreground"
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            :icon="faStopwatch"
                                            class="text-accent"
                                        />
                                        Pending Response from 'Jasper G.'...
                                    </div>
                                </div>
                            </div>
                            <FontAwesomeIcon
                                :icon="faChevronRight"
                                class="text-muted-foreground"
                            />
                        </article>
                    </template>
                </div>
                <div
                    v-if="displayMode.isWeb.value"
                    class="grid grid-cols-2 md:grid-cols-3 gap-2 bg-background-surface"
                >
                    <template v-for="index in 10">
                        <Card
                            v-ripple
                            class="cursor-pointer flex flex-col gap-2 p-2"
                        >
                            <CardHeader class="p-0">
                                <h4>Fringe Festival</h4>
                            </CardHeader>
                            <CardContent class="p-0">
                                <div class="prose flex-1 select-none">
                                    <div
                                        class="prose-sm flex *:px-2 divide-x divide-muted-foreground"
                                    >
                                        <div>
                                            <FontAwesomeIcon
                                                :icon="faCheck"
                                                class="text-primary"
                                            />
                                            Tenor (1/1)
                                        </div>
                                        <div class="text-wrap">
                                            <FontAwesomeIcon
                                                :icon="faExclamationCircle"
                                                shake
                                                class="text-secondary"
                                            />
                                            Soprano (0/1) - Confirm Required
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </template>
                </div>
                <!-- <Card>
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
                                    'border',
                                    {
                                        'rounded-t': index == 1,
                                        'rounded-b': index == 5,
                                    },
                                ]"
                                :left-overlay="{
                                    icon: faPencil,
                                    colour: 'primary',
                                    triggered: () => onEdit(index),
                                }"
                            >
                                <template #overlay>Overlay</template>
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
                </Card> -->
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
import {
    faCheck,
    faChevronRight,
    faExclamationCircle,
    faPencil,
    faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const displayMode = useDisplayMode();

async function onEdit(id: string) {
    await navigateTo(`/jobs/${id}`);
}

definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
</script>
