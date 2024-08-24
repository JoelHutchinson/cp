<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader :profile="profile" />
    <main class="p-6 mt-0 grow overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { profile } = useProfile();
</script>
