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
            console.log(direction.value);
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
        // if (
        //     lengthX.value < 0 &&
        //     containerWidth.value &&
        //     Math.abs(lengthX.value) / containerWidth.value >= 0.5
        // ) {
        //     left.value = "100%";
        //     opacity.value = 1;
        // } else {
        left.value = "0";
        // }
    },
    threshold: 40,
});
</script>

<style scoped>
.overlay.animated {
    transition: all 0.2s ease-in-out;
}

.status {
    text-align: center;
}
</style>
