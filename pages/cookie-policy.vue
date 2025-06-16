<template>
  <UiHeading class="mb-6">Cookie Policy</UiHeading>

  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <span class="font-bold">Last updated June 08, 2025 </span>
        <AppPrivacyPolicyLogo />
      </div>
    </template>

    <div
      class="prose dark:prose-invert p-4 !max-w-none prose-a:text-primary-500 dark:prose-a-primary-400"
    >
      <div v-html="htmlContent"></div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const htmlContent = ref("");

// Load HTML content on mount
onMounted(async () => {
  const res = await fetch("/cookie-policy.html");
  htmlContent.value = await res.text();
});
</script>
