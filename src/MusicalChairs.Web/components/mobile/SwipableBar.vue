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
        <div
            class="z-0 w-full h-full flex justify-between bg-black text-white"
            :class="[direction == 'right' && `bg-${props.leftOverlay.colour}`]"
        >
            <div ref="underlay-left">
                <slot name="underlay-left" v-if="props.leftOverlay == null" />
                <Button
                    v-else
                    class="rounded-none border-none bg-accent h-full"
                    :class="[`bg-${props.leftOverlay.colour}`]"
                >
                    <FontAwesomeIcon :icon="props.leftOverlay.icon" />
                </Button>
            </div>
            <div ref="underlay-right">
                <slot name="underlay-right" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import type { UseSwipeDirection } from "@vueuse/core";
import { useSwipe } from "@vueuse/core";
import { computed, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
    leftOverlay?:
        | {
              triggered: (() => Promise<unknown>) | (() => unknown);
              icon: IconDefinition;
              colour: string;
          }
        | undefined;
}>();

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
const pixels = (number: number) => `${number}px`;
const { direction, isSwiping, lengthX, lengthY } = useSwipe(target, {
    passive: false,
    onSwipe(e: TouchEvent) {
        if (containerWidth.value) {
            let length = lengthX.value;

            // If there is no left, ensure the left.value cannot be negative.
            if (underlayLeft.value.clientWidth == 0) {
                length = Math.max(0, length);
            }

            // If there is no right, ensure the left.value cannot be greater than zero
            if (underlayRight.value.clientWidth == 0) {
                length = Math.min(0, length);
            }

            left.value = pixels(-length);
        } else {
            left.value = "0";
        }
    },
    onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
        if (
            underlayLeft.value.getBoundingClientRect().right + 10 <=
            Number(left.value.replace("px", ""))
        ) {
            props.leftOverlay.triggered();
            left.value = "100%";
        } else {
            left.value = pixels(0);
        }
    },
    threshold: 1,
});
</script>

<style scoped>
.overlay.animated {
    transition: all 0.5s ease-in-out;
}

.status {
    text-align: center;
}
</style>
