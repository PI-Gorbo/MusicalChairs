<template>
    <IonItem
        :router-link="props.routerLink"
        class="select-none cursor-pointer"
        @click="emit('click')"
    >
        {{ props.label }}
    </IonItem>
</template>
<script setup lang="ts">
import { IonItem } from "@ionic/vue";

const props = withDefaults(
    defineProps<{
        routerLink: string;
        label: string;
    }>(),
    {}
);
const emit = defineEmits<{
    click: [];
}>();
</script>
