<template>
  <div class="flex flex-col h-[100dvh]">
    <AppHeader
      :profile="profile"
      @toggle-sidebar="sidebarIsOpen = !sidebarIsOpen"
    />

    <div class="flex flex-row grow h-full overflow-hidden">
      <!-- Left sidebar -->
      <AppSidebar v-model="sidebarIsOpen" />

      <div
        class="flex overflow-y-auto flex-row w-full h-full shadow-lg border-l-[1px] border-t-[1px] md:rounded-l-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
      >
        <!-- Scrollable content -->
        <main
          class="flex-1 overflow-x-hidden md:p-6"
          :class="{ 'p-4': layoutMobilePadding }"
        >
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { profile, fetchProfile } = useFetchProfile();
const { refresh: refreshPuzzleSets } = await useFetchPuzzleSets();

await fetchProfile();
await refreshPuzzleSets();

useProfile();

const route = useRoute();
const layoutMobilePadding = computed(() => !route.meta.layoutMobileNoPadding);
const sidebarIsOpen = ref(false);
</script>
