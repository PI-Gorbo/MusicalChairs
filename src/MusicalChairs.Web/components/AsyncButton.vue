<template>
    <Button :v-bind="props" @click="onClick">
        <span v-if="!isLoading">
            <FontAwesomeIcon v-if="props.async.icon" :icon="props.async.icon" />
            {{ props.async.label }}
        </span>
        <span v-else>
            <FontAwesomeIcon :icon="faSpinner" class="fa-spin" />
            {{ props.async.loadingLabel }}
        </span>
    </Button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSpinner, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { Props } from "./ui/button/Button.vue";

interface AsyncButtonProps extends Props {
    async: (
        | {
              type: "External";
              isLoading: boolean;
          }
        | {
              type: "Click";
              click: () => Promise<unknown>;
          }
    ) & {
        label: string;
        icon?: IconDefinition;
        loadingLabel: string;
    };
}

const props = withDefaults(defineProps<AsyncButtonProps>(), {
    as: "button",
});

const isLoadingFromAsyncClick = ref(false);
async function onClick() {
    if (props.async.type == "Click") {
        isLoadingFromAsyncClick.value = true;
        await props.async
            .click()
            .finally(() => (isLoadingFromAsyncClick.value = false));
    }
}

const isLoading = computed(
    () =>
        isLoadingFromAsyncClick.value ||
        (props.async.type == "External" && props.async.isLoading)
);
</script>
