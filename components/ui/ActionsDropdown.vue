<template>
  <UDropdown :items="actions">
    <UButton
      color="gray"
      variant="ghost"
      icon="i-heroicons-ellipsis-horizontal-20-solid"
      class="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    />
  </UDropdown>
</template>

<script setup lang="ts">
import type { DropdownItem } from "#ui/types";
defineProps<{ actions: DropdownItem[][] }>();
</script>
