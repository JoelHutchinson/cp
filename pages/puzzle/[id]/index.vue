<template>
  <ChessPuzzleInterface :puzzle="testPuzzle" />
</template>

<script setup lang="ts">
const testPuzzle: Puzzle = {
  id: "puzzleId",
  fen: "initialFen",
  solution: "puzzleSolution",
  rating: 5,
  tags: ["tag1", "tag2"],
};
</script>
