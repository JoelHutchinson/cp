<template>
  <header class="flex flex-row items-center justify-end gap-2 p-3">
    <AppColorModeButton />
    <ProfileDropdown v-if="profile" :profile="profile" />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  profile: Profile | null;
}>();
</script>
