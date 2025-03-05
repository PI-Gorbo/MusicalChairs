<template>
    <div class="relative w-full h-full">
        <header class="prose flex justify-between py-2">
            <h3>Your Drafts</h3>
        </header>
        <!-- FAB Button -->
        <div
            :class="
                cn([
                    'absolute right-0',
                    {
                        'bottom-2': displayMode.isMobile.value,
                        'top-2': displayMode.isWeb.value,
                    },
                ])
            "
        >
            <AsyncButton
                class="shadow-square-sm"
                :async="{
                    type: 'Click',
                    click: createNewDraft,
                    label: 'New Draft',
                    icon: faPlus,
                    loadingLabel: 'Creating...',
                }"
            />
        </div>
        <section>
            <AdaptableItemList :items="jobStore.state.myJobs.draftJobs">
                <template #web="draftJobDto">
                    <CardHeader class="p-0 select-none">
                        <h4>{{ draftJobDto.item.name ?? "UNTITLED" }}</h4>
                    </CardHeader>
                    <CardContent class="p-0">
                        <Badge
                            class="bg-background text-foreground hover:bg-background"
                        >
                            <TimeAgo
                                :time="new Date(draftJobDto.item.createdAt)"
                                v-slot="{ timeAge }"
                            >
                                Created {{ timeAge }}
                            </TimeAgo>
                        </Badge>
                    </CardContent>
                </template>
                <template #mobile="draftJobDto">
                    <div class="flex flex-col flex-1 select-none">
                        <header class="select-none prose">
                            <h5>{{ draftJobDto.item.name ?? "UNTITLED" }}</h5>
                        </header>
                        <div class="">
                            <Badge
                                class="bg-background text-foreground hover:bg-background"
                            >
                                <UseTimeAgo
                                    v-slot="{ timeAgo }"
                                    :time="new Date(draftJobDto.item.createdAt)"
                                >
                                    Created {{ timeAgo }}
                                </UseTimeAgo>
                            </Badge>
                        </div>
                    </div>
                </template>
            </AdaptableItemList>
        </section>
    </div>
</template>
<script setup lang="ts">
import {
    faCheck,
    faExclamationCircle,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { cn } from "~/utils";
import { toast } from "vue-sonner";
import { UseTimeAgo } from "@vueuse/components";

definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
const jobStore = useJobStore();
const displayMode = useDisplayMode();

const api = useApi();
async function createNewDraft() {
    const createNewDraftResponse = await api.job.createDraft();
    if (createNewDraftResponse.name === "Error") {
        toast.error(
            `Something went wrong while trying to create a draft. ${createNewDraftResponse.fields[0]}`
        );
        return;
    } else {
        toast.success("Draft created!");
    }

    await jobStore.refresh();
}
</script>
