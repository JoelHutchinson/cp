<template>
  <ChessPuzzleInterface v-if="puzzle" :puzzle="puzzle" />
</template>

<script setup lang="ts">
const { id } = useRoute().params as { id: string };
const { puzzle, fetch: fetchPuzzle } = usePuzzle(id);
fetchPuzzle();
</script>
