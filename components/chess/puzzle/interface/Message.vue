<template>
  <div class="flex flex-row sm:flex-col items-center gap-2 p-2">
    <UIcon
      :key="statusMeta.icon"
      :name="statusMeta.icon"
      :class="statusMeta.iconClass"
      class="hidden sm:block sm:size-8"
    />
    <span :class="statusMeta.spanClass">
      {{ statusMeta.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  puzzleBoardState: PuzzleBoardState;
}>();

function colorText(color: string) {
  if (color === "white") return "white";
  if (color === "black") return "black";
  return "";
}

const statusMeta = computed(() => {
  // Determine correctness of last move, if any
  const lastAttempt = props.puzzleBoardState?.moveAttempts?.at(-1);
  const lastCorrect = lastAttempt?.isCorrect ?? null;

  let message = "";
  let icon = "";
  let iconClass = "text-primary-500 dark:text-primary-400 w-full";
  const color = colorText(props.puzzleBoardState.nextToMove);

  if (props.puzzleBoardState.status === "not_started") {
    message = color ? `Find the best move for ${color}` : "Find the best move";
    icon = "i-heroicons-light-bulb-20-solid";
  } else if (props.puzzleBoardState.status === "in_progress") {
    if (lastCorrect === true) {
      message = "Keep going, you're on the right track!";
      icon = "i-heroicons-check-circle-20-solid";
    } else if (lastCorrect === false) {
      message = "Incorrect, try again.";
      icon = "i-heroicons-x-circle-20-solid";
    } else {
      message = "Puzzle in progress...";
      icon = "i-heroicons-light-bulb-20-solid";
    }
  } else if (props.puzzleBoardState.status === "finished") {
    message = "Puzzle solved! Great job!";
    icon = "i-heroicons-cake-20-solid";
  }

  return {
    message,
    icon,
    iconClass,
    spanClass:
      "text-gray-600 dark:text-gray-300 text-sm truncate sm:text-xl font-semibold text-center whitespace-nowrap truncate sm:whitespace-normal",
  };
});
</script>
