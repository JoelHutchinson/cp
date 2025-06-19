<template>
  <UiHeading class="mb-6">Privacy Policy</UiHeading>
  <UCard class="w-full">
    <template #header>
      <div class="flex justify-between items-center gap-2">
        <span class="font-bold">Last updated June 08, 2025</span>
        <AppPrivacyPolicyLogo />
      </div>
    </template>

    <div
      class="prose dark:prose-invert min-h-[100vh] !max-w-none prose-a:text-primary-500 dark:prose-a-primary-400"
    >
      <div v-if="loading" class="space-y-6">
        <div v-for="(section, index) in 8" :key="index" class="space-y-2">
          <!-- Simulated heading -->
          <USkeleton
            :class="[
              'rounded',
              'h-5',
              headingWidths[index % headingWidths.length],
            ]"
          />

          <!-- Simulated paragraph lines -->
          <USkeleton
            v-for="n in 3"
            :key="n"
            :class="[
              'rounded',
              'h-4',
              paragraphWidths[(index + n) % paragraphWidths.length],
            ]"
          />
        </div>
      </div>

      <div v-else v-html="htmlContent"></div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const htmlContent = ref("");
const loading = ref(true);

const headingWidths = ["w-1/2", "w-1/3", "w-1/4"];
const paragraphWidths = ["w-full", "w-5/6", "w-3/4", "w-2/3"];

onMounted(async () => {
  const res = await fetch("/privacy-policy.html");
  htmlContent.value = await res.text();
  loading.value = false;
});
</script>
