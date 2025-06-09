<template>
  <div class="flex flex-row items-center gap-2">
    <NuxtImg
      src="logo-light.png"
      alt="Logo"
      class="rounded-lg size-7 md:size-9 dark:hidden"
    />
    <NuxtImg
      src="logo-dark.png"
      alt="Logo"
      class="rounded-lg size-7 md:size-9 hidden dark:block"
    />

    <div class="flex flex-row items-center">
      <span
        class="text-2xl md:text-3xl text-primary-500 dark:text-primary-400 font-semibold uppercase tracking-wide opacity-80"
        >Chess</span
      >
      <span
        class="text-2xl md:text-3xl font-semibold uppercase tracking-wide opacity-60"
        >Pecker</span
      >
    </div>
  </div>
</template>
