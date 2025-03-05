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
        <div>
            {{ jobStore.state.myJobs.draftJobs }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { cn } from "~/utils";
import { toast } from "vue-sonner";

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
