<template>
  <div class="flex flex-row">
    <UHorizontalNavigation
      :links="links"
      class="border-b border-gray-200 dark:border-gray-800"
    />
    <ProfileDropdown
      v-if="profile"
      :name="`${profile.first_name} ${profile.last_name}`"
      :username="profile.username"
      :email="profile.email"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
}>();

const links = [
  {
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Solve",
    icon: "i-heroicons-puzzle-piece",
    to: "/solve",
  },
];
</script>
