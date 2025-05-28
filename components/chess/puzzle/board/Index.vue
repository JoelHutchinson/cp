<template>
  <ChessBoard
    v-bind="$attrs"
    :view-only="isViewOnly"
    :width="600"
    :height="600"
    @move="onMove"
    @board-created="(api) => (boardApi = api)"
  />
</template>

<script setup lang="ts">
import type { MoveEvent, Piece, SquareKey } from "vue3-chessboard";

const props = defineProps<{
  puzzle: Puzzle;
}>();

const emit = defineEmits<{
  (e: "solved"): void;
}>();

defineShortcuts({
  ArrowLeft: () => {
    prevViewMove();
  },
  ArrowRight: () => {
    nextViewMove();
  },
});

// Initially, make the first solution move
onMounted(() => {
  boardApi.value?.setPosition(props.puzzle.fen);
  boardApi.value?.makeMove(solutionMoves.value[0]);
});

// If the puzzle prop changes, reset the moves made and set the position
watch(
  () => props.puzzle,
  (puzzle) => {
    solutionMovesMade.value = [];
    viewMovesMade.value = [];

    boardApi.value?.setPosition(puzzle.fen);
    boardApi.value?.makeMove(solutionMoves.value[0]);
  }
);

const boardApi: Ref<ChessBoardAPI | null> = ref(null);

// If the solution moves made string is equal to the puzzle moves string, the puzzle is solved
const puzzleSolved = computed(
  () => solutionMovesMadeStr.value === props.puzzle.moves
);

// If the board is not showing the latest position or the puzzle has been solved, it should be in view-only mode
const isViewOnly = computed(() => {
  return (
    solutionMovesMadeStr.value !== viewMovesMadeStr.value || puzzleSolved.value
  );
});

// Puzzle solution
const solutionMoves = computed(() => props.puzzle.moves.split(" "));

// Solution moves made (all of the solution moves that have been made)
const solutionMovesMade = ref<string[]>([]);
const solutionMovesMadeStr = computed(() => solutionMovesMade.value.join(" "));

// View moves made (what is shown on the board)
const viewMovesMade = ref<string[]>([]);
const viewMovesMadeStr = computed(() => viewMovesMade.value.join(" "));

const onMove = (move: MoveEvent) => {
  // Check if the move is a solution move or a view move (i.e. has it been made before)
  if (!solutionMovesMade.value.includes(move.lan)) {
    handleSolutionMove(move.lan);

    if (solutionMovesMadeStr.value === props.puzzle.moves) {
      emit("solved");
      console.log("Puzzle solved!");
    }
  }
};

const handleSolutionMove = (move: string) => {
  // Check if the move is correct
  if (solutionMoves.value[solutionMovesMade.value.length] === move) {
    console.log("Correct move!");

    solutionMovesMade.value.push(move);
    nextViewMove();

    // Make the next move if the puzzle is not solved AND it is not the user's turn
    if (
      solutionMovesMadeStr.value !== props.puzzle.moves &&
      solutionMovesMade.value.length % 2 === 0
    ) {
      setTimeout(() => {
        boardApi.value?.makeMove(
          solutionMoves.value[solutionMovesMade.value.length]
        );
      }, 500);
    }
  } else {
    console.log("Incorrect move!");

    // After a delay, undo the move
    setTimeout(() => {
      boardApi.value?.undoLastMove();
    }, 500);
  }
};

const prevViewMove = () => {
  if (viewMovesMade.value.length === 0) {
    return;
  }

  const lastMove = viewMovesMade.value.pop();
  if (lastMove) {
    boardApi.value?.undoLastMove();
  }
};

const nextViewMove = () => {
  if (solutionMovesMadeStr.value === viewMovesMadeStr.value) {
    return;
  }

  const nextMove = solutionMovesMade.value[viewMovesMade.value.length];

  boardApi.value?.makeMove(nextMove);
  viewMovesMade.value.push(nextMove);
};

defineExpose({
  nextViewMove,
  prevViewMove,
});
</script>
