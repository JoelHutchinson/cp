<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar :alt="fullName" />

    <template #account="{ item }">
      <div class="text-left">
        <p class="truncate font-medium text-gray-900 dark:text-white">
          <strong>{{ item.name }}</strong>
        </p>
        <p class="truncate text-gray-900 dark:text-white">
          {{ item.email }}
        </p>
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
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
    },
  ],
];
</script>
