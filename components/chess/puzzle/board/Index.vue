<template>
  <div class="flex flex-col w-fit gap-1">
    <ChessBoard
      v-bind="$attrs"
      :on-move="onMove"
      :view-only="isViewOnly"
      :width="400"
      :height="400"
      @board-created="(api) => (boardApi = api)"
    />
    <div class="flex flex-row justify-between">
      <ChessPuzzleBoardButton
        icon="i-heroicons-arrow-long-left"
        @click="prevViewMove"
      />
      <ChessPuzzleBoardButton
        icon="i-heroicons-arrow-long-right"
        @click="nextViewMove"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Piece, SquareKey } from "vue3-chessboard";

const props = defineProps<{
  puzzle: Puzzle;
}>();

const emit = defineEmits<{
  (e: "solved"): void;
}>();

// Initially, make the first solution move
onMounted(() => {
  boardApi.value?.setPosition(props.puzzle.FEN);
  boardApi.value?.makeMove(solutionMoves.value[0]);
});

// If the puzzle prop changes, reset the moves made and set the position
watch(
  () => props.puzzle,
  (puzzle) => {
    solutionMovesMade.value = [];
    viewMovesMade.value = [];

    boardApi.value?.setPosition(puzzle.FEN);
    boardApi.value?.makeMove(solutionMoves.value[0]);
  }
);

const boardApi: Ref<ChessBoardAPI | null> = ref(null);

// If the solution moves made string is equal to the puzzle moves string, the puzzle is solved
const puzzleSolved = computed(
  () => solutionMovesMadeStr.value === props.puzzle.Moves
);

// If the board is not showing the latest position or the puzzle has been solved, it should be in view-only mode
const isViewOnly = computed(() => {
  return (
    solutionMovesMadeStr.value !== viewMovesMadeStr.value || puzzleSolved.value
  );
});

// Puzzle solution
const solutionMoves = computed(() => props.puzzle.Moves.split(" "));

// Solution moves made (all of the solution moves that have been made)
const solutionMovesMade = ref<string[]>([]);
const solutionMovesMadeStr = computed(() => solutionMovesMade.value.join(" "));

// View moves made (what is shown on the board)
const viewMovesMade = ref<string[]>([]);
const viewMovesMadeStr = computed(() => viewMovesMade.value.join(" "));

const onMove = (
  orig: SquareKey,
  dest: SquareKey,
  capturedPiece?: Piece | undefined
) => {
  const move = orig + dest;

  // Check if the move is a solution move or a view move (i.e. has it been made before)
  if (!solutionMovesMade.value.includes(move)) {
    handleSolutionMove(move);

    if (solutionMovesMadeStr.value === props.puzzle.Moves) {
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
      solutionMovesMadeStr.value !== props.puzzle.Moves &&
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
</script>
