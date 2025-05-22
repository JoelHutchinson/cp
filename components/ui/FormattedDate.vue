<template>
  <UTooltip
    :text="date.toLocaleString('en-gb')"
    :open-delay="200"
    :popper="{ placement: 'bottom-start' }"
  >
    <span class="capitalize">
      {{ formatTimeAgo(date) }}
    </span>
  </UTooltip>
</template>

<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";

const props = defineProps<{ date: string }>();
const date = computed(() => new Date(props.date));
</script>
