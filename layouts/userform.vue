<template>
  <div>
    <AppColorModeButton class="absolute top-2 right-2" />

    <main class="grid min-h-screen place-items-center">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
