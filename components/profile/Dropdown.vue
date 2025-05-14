<template>
  <UDropdown
    :items="items"
    :ui="{ width: 'w-fit', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar :alt="fullName" />

    <template #account="{ item }">
      <div class="flex flex-col gap-1 text-left">
        <div>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            <strong>{{ item.name }}</strong>
          </p>
          <p class="truncate text-gray-900 dark:text-white">
            {{ item.email }}
          </p>
        </div>
        <span
          class="flex flex-row text-sm text-gray-500 dark:text-gray-400 items-center gap-0.5"
        >
          <UIcon name="i-heroicons-puzzle-piece-20-solid" />
          {{ item.puzzleRating }}
        </span>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
const props = defineProps<{ profile: Profile }>();
const fullName = computed(
  () => `${props.profile.first_name} ${props.profile.last_name}`
);

const items = [
  [
    {
      email: props.profile.email,
      name: fullName,
      puzzleRating: 600, // TODO: Add puzzle_rating to the profile
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        const supabase = useSupabaseClient();
        await supabase.auth.signOut();
        await navigateTo("/login");
      },
    },
  ],
];
</script>
