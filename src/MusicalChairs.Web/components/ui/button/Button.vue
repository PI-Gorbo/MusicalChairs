<template>
    <Primitive
        :as="as"
        :as-child="asChild"
        :class="cn(buttonVariants({ variant, size }), props.class)"
        v-ripple
    >
        <slot />
    </Primitive>
</template>
<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils";
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonVariants, buttonVariants } from ".";

export interface Props extends PrimitiveProps {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
    as: "button",
});
</script>
