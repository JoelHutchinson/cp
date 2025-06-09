<template>
  <div class="flex flex-col h-screen">
    <AppHeader
      :profile="profile"
      @toggle-sidebar="sidebarIsOpen = !sidebarIsOpen"
    />
    <div class="flex flex-row grow h-full overflow-hidden">
      <AppSidebar v-model="sidebarIsOpen" />
      <main
        class="w-full md:p-6 overflow-auto shadow-lg border-l-[1px] border-t-[1px] md:rounded-l-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-900 h-full"
        :class="{ 'p-4': layoutMobilePadding }"
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

const route = useRoute();
const layoutMobilePadding = computed(() => !route.meta.layoutMobileNoPadding);
const sidebarIsOpen = ref(false);
</script>
