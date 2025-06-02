<template>
  <header class="flex flex-row items-center justify-between p-3">
    <AppLogo />
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
