<template>
  <div class="flex items-center gap-2 p-2">
    <UIcon
      :key="statusMeta.icon"
      :name="statusMeta.icon"
      :class="statusMeta.iconClass"
      class="size-8"
    />
    <span :class="statusMeta.spanClass">
      {{ statusMeta.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: PuzzleStatus;
}>();

const statusMeta = computed(() => {
  const messages = {
    notStarted: `Find the best move`,
    inProgressCorrect: "Keep going, you're on the right track!",
    inProgressIncorrect: "Incorrect move, try again.",
    solved: "Puzzle solved! Great job!",
  };

  const icons = {
    notStarted: "i-heroicons-light-bulb-20-solid",
    inProgressCorrect: "i-heroicons-check-circle-20-solid",
    inProgressIncorrect: "i-heroicons-x-circle-20-solid",
    solved: "i-heroicons-cake-20-solid",
  };

  const iconClasses = {
    notStarted: "text-primary-500 dark:text-primary-400",
    inProgressCorrect: "text-primary-500 dark:text-primary-400",
    inProgressIncorrect: "text-primary-500 dark:text-primary-400",
    solved: "text-primary-500 dark:text-primary-400",
  };

  return {
    message: messages[props.status],
    icon: icons[props.status],
    iconClass: `${iconClasses[props.status]} text-2xl`,
    spanClass: "text-gray-500 dark:text-gray-400 text-xl font-semibold",
  };
});
</script>
