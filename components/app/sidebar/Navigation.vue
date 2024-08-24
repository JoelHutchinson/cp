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
    sectionTitle: "Puzzles",
    links: [{ label: "Woodpecker Method", to: "/solve" }],
  },
  {
    sectionTitle: "Settings",
    links: [{ label: "Profile", to: "/profile" }],
  },
];
</script>
