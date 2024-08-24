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

  <!-- 
   <div class="flex h-screen flex-col">
    <LayoutHeader />
    <div class="flex grow overflow-hidden">
      <LayoutSidebar />
      <main class="m-2 ml-0 grow">
        <div
          class="h-full rounded-lg shadow-[0_0_6px_#0000000C] dark:shadow-[0_0_8px_#00000030]"
        >
          <div
            class="h-full overflow-auto rounded-[inherit] bg-[#FDFDFD] px-12 py-10 [scrollbar-gutter:stable] dark:bg-[#1E1E1E]"
          >
            <div class="mx-auto max-w-6xl">
              <slot></slot>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
   -->
</template>

<script setup lang="ts">
const { profile, fetch: fetchProfile } = useProfile();
fetchProfile();
</script>
