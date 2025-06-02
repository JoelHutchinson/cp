<template>
  <div class="flex flex-col h-screen">
    <AppHeader
      :profile="profile"
      @toggle-sidebar="sidebarIsOpen = !sidebarIsOpen"
    />
    <div class="flex flex-row grow h-full">
      <AppSidebar v-model="sidebarIsOpen" />
      <main
        class="w-full p-0 md:p-6 overflow-hidden shadow-lg border-l-[1px] border-t-[1px] md:rounded-l-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-900 h-full"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { profile, fetchProfile } = useFetchProfile();
const { data: puzzleSets } = await useFetchPuzzleSets();
const { fetchDefaultPuzzleSet } = useFetchDefaultPuzzleSet();

await fetchProfile();
await fetchDefaultPuzzleSet();

const sidebarIsOpen = ref(false);
</script>
