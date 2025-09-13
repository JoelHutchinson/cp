<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<script setup lang="ts">
import { until } from "@vueuse/core";

const { user } = useProfile();
</script>
