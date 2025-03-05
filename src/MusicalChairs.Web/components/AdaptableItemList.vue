<template>
    <div>
        <div
            v-if="displayMode.isMobile.value"
            class="flex flex-col bg-background-surface divide-y divide-muted-foreground *:py-2 *:px-1 border-b border-t"
        >
            <template v-for="(item, index) in props.items">
                <article v-ripple class="flex items-center">
                    <slot name="mobile" :item="item" :index="index" />
                    
                    <FontAwesomeIcon
                        :icon="faChevronRight"
                        class="text-muted-foreground"
                    />
                </article>
            </template>
        </div>
        <div
            v-if="displayMode.isWeb.value"
            class="grid grid-cols-2 md:grid-cols-3 gap-2 bg-background-surface"
        >
            <template v-for="(item, index) in props.items">
                <Card
                    v-ripple
                    class="cursor-pointer flex flex-col gap-2 p-2 pressable"
                >
                    <slot name="web" :item="item" :index="index" />
                </Card>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts" generic="T">
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const displayMode = useDisplayMode();
const props = defineProps<{
    items: T[];
}>();

const slots = defineSlots<{
    mobile(props: { item: T; index: number });
    web(props: { item: T; index: number });
}>();
</script>
