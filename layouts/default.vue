<template>
  <div class="flex flex-col h-screen">
    <AppHeader
      :profile="profile"
      @toggle-sidebar="sidebarIsOpen = !sidebarIsOpen"
    />

    <div class="flex flex-row grow h-full overflow-hidden">
      <!-- Left sidebar -->
      <AppSidebar v-model="sidebarIsOpen" />

      <!-- Main area including scrollable content and fixed-width sticky ad -->
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

        <!-- Sticky ad sidebar (not scrollable) -->
        <aside
          class="hidden border-l border-gray-200 dark:border-gray-700 lg:flex p-4 shrink-0 w-[192px]"
        >
          <div class="sticky">
            <div id="ezoic-pub-ad-placeholder-118"></div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  script: [
    {
      children: `
        ezstandalone.cmd.push(function () {
          ezstandalone.showAds(118);
        });
      `,
      type: "text/javascript",
    },
  ],
});

const { profile, fetchProfile } = useFetchProfile();
const { data: puzzleSets } = await useFetchPuzzleSets();
const { fetchDefaultPuzzleSet } = useFetchDefaultPuzzleSet();

await fetchProfile();
await fetchDefaultPuzzleSet();

const route = useRoute();
const layoutMobilePadding = computed(() => !route.meta.layoutMobileNoPadding);
const sidebarIsOpen = ref(false);
</script>
