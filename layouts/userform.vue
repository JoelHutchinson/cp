<template>
  <div>
    <AppColorModeButton class="absolute top-2 right-2" />

    <main class="grid min-h-screen place-items-center">
      <div class="flex flex-col items-center gap-6">
        <AppLogo />
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>
