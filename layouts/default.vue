<template>
  <div class="flex flex-col h-screen">
    <AppHeader :profile="profile" />
    <div class="flex flex-row grow h-full">
      <AppSidebar />
      <main
        class="w-full p-6 overflow-hidden shadow-lg border-l-[1px] border-t-[1px] rounded-l-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-900 h-full"
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
</script>
