<template>
  <ClientOnly>
    <UButton
      aria-label="Theme"
      color="gray"
      variant="ghost"
      @click="toggleColorMode"
      :icon="
        colorMode.value === 'dark'
          ? 'i-heroicons-moon-20-solid'
          : 'i-heroicons-sun-20-solid'
      "
      v-bind="$attrs"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>
