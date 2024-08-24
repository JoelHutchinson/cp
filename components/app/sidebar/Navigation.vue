<template>
  <div v-for="linkSection in linkSections" :key="linkSection.sectionTitle">
    <h6
      class="mb-1 ml-1 text-2xs font-semibold uppercase tracking-wide opacity-60"
    >
      {{ linkSection.sectionTitle }}
    </h6>

    <UVerticalNavigation :links="linkSection.links" />
  </div>
</template>

<script setup lang="ts">
const linkSections = [
  {
    sectionTitle: "Training",
    links: [
      {
        label: "Woodpecker",
        to: "/puzzle",
        icon: "i-heroicons-puzzle-piece-20-solid",
      },
    ],
  },
  {
    sectionTitle: "Settings",
    links: [
      {
        label: "Profile",
        to: "/profile",
        icon: "i-heroicons-user-circle-20-solid",
      },
    ],
  },
];
</script>
