<template>
    <div ref="container" class="relative flex overflow-hidden select-none">
        <div
            ref="target"
            class="absolute top-0 left-0 w-full h-full bg-background z-10"
            :class="{ animated: !isSwiping }"
            :style="{ left, right }"
        >
            <slot name="overlay" />
        </div>
        <div class="z-0 w-full h-full flex justify-between bg-black text-white">
            <div ref="underlay-left">
                <slot name="underlay-left" />
            </div>
            <div ref="underlay-right">
                <slot name="underlay-right" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UseSwipeDirection } from "@vueuse/core";
import { useSwipe } from "@vueuse/core";
import { computed, ref } from "vue";

const emit = defineEmits<{
    "underlay-left-activated": [];
    "underlay-right-activated": [];
}>();

const target = useTemplateRef("target");
const container = useTemplateRef("container");
const containerWidth = computed(() => container.value?.offsetWidth);
const left = ref("0");
const right = ref("0");

const underlayLeft = useTemplateRef("underlay-left");
const underlayRight = useTemplateRef("underlay-right");

const { direction, isSwiping, lengthX, lengthY } = useSwipe(target, {
    passive: false,
    onSwipe(e: TouchEvent) {
        // debugger;
        if (containerWidth.value) {
            if (
                direction.value == "right" &&
                underlayLeft.value.clientWidth > 0
            ) {
                const length = Math.min(
                    Math.abs(lengthX.value),
                    underlayLeft.value.clientWidth
                );
                left.value = `${length}px`;
            } else if (
                direction.value == "left" &&
                underlayRight.value.clientWidth > 0
            ) {
                const length = Math.min(
                    Math.abs(lengthX.value),
                    underlayRight.value.clientWidth
                );
                left.value = `${-1 * length}px`;
            }
        } else {
            left.value = "0";
        }
    },
    onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
        setTimeout(() => {
            left.value = "0";
        }, 100);

        if (
            Number(left.value.replace("px", "")) ==
            underlayLeft.value.clientWidth
        ) {
            emit("underlay-left-activated");
        }
    },
});
</script>

<style scoped>
.overlay.animated {
    transition: left 10s ease-in-out;
}

.status {
    text-align: center;
}
</style>
