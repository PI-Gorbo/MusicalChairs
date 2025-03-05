<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <UseTimeAgo v-slot="{ timeAgo }" :time="props.time">
                    <slot :timeAge="timeAgo" />
                </UseTimeAgo>
            </TooltipTrigger>
            <TooltipContent class="bg-background text-foreground border">
                {{ formattedDate }}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";
import { format } from "date-fns";
const props = defineProps<{
    time: Date;
}>();

const formattedDate = computed(() => format(props.time, "PPpp"));
</script>
