<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<script setup lang="ts">
import { until } from "@vueuse/core";

const { user, createGuestProfile } = useProfile();

// Wait for auth to hydrate and trigger guest creation if needed
onMounted(async () => {
  await until(user).toMatch((u) => u !== undefined);

  if (!user.value) {
    console.info("No user found, creating guest profile...");
    const { error } = await createGuestProfile();
    if (error) {
      console.error("Failed to create guest profile:", error);
    } else {
      console.info("Guest profile created.");
    }
  } else {
    console.info("User already exists, no need to create guest profile.");
  }
});
</script>
