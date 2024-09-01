<template>
  <header class="flex flex-row items-center justify-between p-3">
    <div>
      <span
        class="text-3xl text-primary-500 dark:text-primary-400 font-semibold uppercase tracking-wide opacity-60"
        >Nova</span
      ><span class="text-3xl font-semibold uppercase tracking-wide opacity-60"
        >chess</span
      >
    </div>
    <div class="flex flex-row items-center gap-2">
      <AppColorModeButton />
      <ProfileDropdown v-if="profile" :profile="profile" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  profile: Profile | null;
}>();
</script>
