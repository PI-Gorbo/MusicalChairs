<template>
    <div class="flex justify-center w-full h-full">
        <div class="max-w-page w-full">
            <section>
                <header class="prose"><h3>Actve Jobs</h3></header>
                <AdaptableItemList :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]">
                    <template #web>
                        <CardHeader class="p-0 select-none">
                            <h4>Fringe Festival</h4>
                        </CardHeader>
                        <CardContent class="p-0">
                            <div class="flex gap-1">
                                <Badge
                                    class="bg-background text-foreground flex gap-1 hover:bg-background select-none"
                                >
                                    <FontAwesomeIcon
                                        :icon="faCheck"
                                        class="text-primary"
                                    />
                                    Tenor (1/1)
                                </Badge>
                                <Badge
                                    class="text-wrap bg-background text-foreground flex gap-1 hover:bg-background select-none"
                                >
                                    <FontAwesomeIcon
                                        :icon="faExclamationCircle"
                                        shake
                                        class="text-secondary"
                                    />
                                    Soprano (0/1) - Confirm Required
                                </Badge>
                            </div>
                        </CardContent>
                    </template>
                    <template #mobile>
                        <div class="flex flex-col flex-1 select-none">
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
                    </template>
                </AdaptableItemList>
            </section>
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
