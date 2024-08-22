<template>
  <div>
    <AppHeader :profile="profile" />
    <slot />
  </div>
</template>

<script setup lang="ts">
const { profile } = useProfile();
</script>
