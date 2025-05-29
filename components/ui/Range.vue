<template>
  <div
    class="flex flex-col rounded-md justify-center items-center p-3 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400"
  >
    <span class="flex items-center gap-1 text-gray-500 dark:text-gray-400"
      ><UIcon :name="icon" />{{ model }}</span
    >
    <URange v-model="model" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<number>({
  required: true,
});

defineProps<{ icon: string }>();
</script>
