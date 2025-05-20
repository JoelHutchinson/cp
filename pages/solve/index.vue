<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "02-solve",
});

const { defaultPuzzleSet, fetchDefaultPuzzleSet } = useFetchDefaultPuzzleSet();

if (!defaultPuzzleSet.value) await fetchDefaultPuzzleSet();

await navigateTo(`/solve/${defaultPuzzleSet.value!.slug}`);
</script>
