<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "02-solve",
});

const notifications = useNotification();

const { defaultPuzzleSet, fetchDefaultPuzzleSet, fetchDefaultPuzzleSetError } =
  useFetchDefaultPuzzleSet();

if (!defaultPuzzleSet.value) await fetchDefaultPuzzleSet();

if (fetchDefaultPuzzleSetError.value?.statusCode === 404) {
  notifications.info({
    title: "No default puzzle set found",
    message: "You must create at least one puzzle set before solving puzzles.",
  });

  await navigateTo("/puzzle-set");
}

await navigateTo(`/solve/${defaultPuzzleSet.value!.slug}`);
</script>
