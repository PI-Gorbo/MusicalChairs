<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-lg border-2 bg-card text-card-foreground shadow-square-sm',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
