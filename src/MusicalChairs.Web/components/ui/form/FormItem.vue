<script lang="ts" setup>
import { cn } from "@/utils";
import { useId } from "radix-vue";
import { type HTMLAttributes, provide } from "vue";
import { FORM_ITEM_INJECTION_KEY } from "./injectionKeys";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);
</script>

<template>
    <div :class="cn(props.class)">
        <slot />
    </div>
</template>
