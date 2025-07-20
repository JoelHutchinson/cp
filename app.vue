<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<script setup lang="ts">
import { createPinia } from "pinia";

// Wait for auth to hydrate and trigger guest creation if needed
onMounted(async () => {
  // await until(user).toMatch((u) => u !== undefined);
});
</script>
