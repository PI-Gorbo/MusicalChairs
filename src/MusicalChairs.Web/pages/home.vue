<template>
    <div class="overflow-y-auto">
        <section>
            <header class="text-xl font-semibold py-2">Active Jobs</header>
            <ul class="flex flex-col gap-2">
                <Card v-for="index in 5">
                    <CardHeader
                        class="px-2 pt-1 pb-0 flex flex-row items-center"
                        ><span class="flex-1">Job Name</span>
                        <div class="flex text-sm gap-2">
                            <Button variant="ghost" class="p-2">
                                <FontAwesomeIcon size="sm" :icon="faPen" />
                                <span class="text-sm">Edit</span>
                            </Button>
                            <Button class="p-2" variant="destructive">
                                <FontAwesomeIcon size="sm" :icon="faTrash" />
                                <span class="text-sm">Delete</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent class="py-2 px-4 text-sm">
                        <div>Tenor - 4 positions | 0 contacts</div>
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
            </ul>
        </section>
        <section>
            <header class="text-xl font-semibold py-2">Your Draft Jobs</header>
            <ul class="flex flex-col gap-2">
                <Card v-for="index in 5">
                    <CardHeader
                        class="px-2 pt-1 pb-0 flex flex-row items-center"
                        ><span class="flex-1">Job Name</span>
                        <div class="flex text-sm gap-2">
                            <Button variant="ghost" class="p-2">
                                <FontAwesomeIcon size="sm" :icon="faPen" />
                                <span class="text-sm">Edit</span>
                            </Button>
                            <Button class="p-2" variant="destructive">
                                <FontAwesomeIcon size="sm" :icon="faTrash" />
                                <span class="text-sm">Delete</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent class="py-2 px-4 text-sm">
                        <div>Tenor - 4 positions | 0 contacts</div>
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
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import {
    faCheck,
    faPen,
    faTrash,
    faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

definePageMeta({
    requiresAuth: true,
    layout: "logged-in",
});
</script>
