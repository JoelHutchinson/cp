<template>
  <header class="flex flex-row">
    <UHorizontalNavigation
      :links="links"
      class="border-b border-gray-200 dark:border-gray-800"
    />
    <AppColorModeButton />
    <ProfileDropdown
      v-if="profile"
      :name="`${profile.first_name} ${profile.last_name}`"
      :username="profile.username"
      :email="profile.email"
    />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  profile: Profile | null;
}>();

const links = [
  {
    label: "Solve",
    icon: "i-heroicons-puzzle-piece",
    to: "/solve",
  },
];
</script>
