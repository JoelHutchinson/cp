<template>
  <header class="flex flex-row items-center justify-between p-3">
    <UButton
      class="md:hidden"
      @click="$emit('toggle-sidebar')"
      icon="i-heroicons-bars-3"
    />
    <AppLogo class="hidden md:flex" />
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

defineEmits<{
  (e: "toggle-sidebar"): void;
}>();
</script>
