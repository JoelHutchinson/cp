<template>
  <div class="overflow-hidden">
    <AppColorModeButton class="absolute top-2 right-2" />

    <main class="grid min-h-screen place-items-center">
      <div class="flex flex-col items-center gap-6">
        <AppLogo />
        <slot />
      </div>
    </main>

    <UButton
      class="absolute bottom-4 right-4"
      variant="link"
      color="gray"
      to="/privacy-policy"
      target="_blank"
    >
      Privacy Policy
    </UButton>
  </div>
</template>

<script setup lang="ts"></script>
