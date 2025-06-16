<template>
  <aside
    class="hidden md:flex shrink-0 basis-48 flex-col gap-6 overflow-auto p-2.5 list-none marker:content-none"
  >
    <AppSidebarNavigation />
  </aside>
  <USlideover
    v-model="isOpen"
    side="left"
    class="md:hidden min-w-[250px] w-1/2 gap-6"
    :ui="{ padding: 'p-2.5' }"
  >
    <div class="flex flex-col gap-6 h-full">
      <AppLogo />
      <AppSidebarNavigation />
    </div>
  </USlideover>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>({
  required: true,
});
</script>
