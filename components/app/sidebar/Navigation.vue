<template>
  <div v-for="linkSection in linkSections" :key="linkSection.sectionTitle">
    <h6
      class="mb-1 ml-1 text-2xs font-semibold uppercase tracking-wide opacity-60"
    >
      {{ linkSection.sectionTitle }}
    </h6>
    <UVerticalNavigation :links="linkSection.links">
      <template #default="{ link }">
        <UChip
          v-if="link.slot === 'stats'"
          position="top-right"
          text="Coming soon!"
          size="lg"
          :ui="{
            translate: {
              'top-right': '-translate-y-1/3 translate-x-[65px] transform',
            },
          }"
          >{{ link.label }}</UChip
        >
      </template>
    </UVerticalNavigation>
  </div>
</template>

<script setup lang="ts">
const linkSections = [
  {
    sectionTitle: "Woodpecker",
    links: [
      {
        label: "Solve",
        to: "/solve",
        icon: "i-heroicons-puzzle-piece-20-solid",
      },
      {
        label: "Puzzle Sets",
        to: "/puzzle-set",
        icon: "i-heroicons-queue-list-20-solid",
      },
      {
        label: "Stats",
        icon: "i-heroicons-chart-bar-20-solid",
        slot: "stats",
      },
    ],
  },
  {
    sectionTitle: "Community",
    links: [
      {
        label: "About",
        to: "/about",
        icon: "i-heroicons-information-circle-20-solid",
      },
      {
        label: "Contact",
        to: "/contact",
        icon: "i-heroicons-envelope-20-solid",
      },
      {
        label: "Privacy Policy",
        to: "/privacy-policy",
        icon: "i-heroicons-shield-check-20-solid",
      },
      {
        label: "Support Me",
        to: "/support",
        icon: "i-heroicons-gift-20-solid",
      },
    ],
  },
];
</script>
