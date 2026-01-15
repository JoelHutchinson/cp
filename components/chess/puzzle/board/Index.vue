<template>
  <ChessBoard
    v-bind="$attrs"
    :view-only="isViewOnly"
    v-model:width="width"
    v-model:height="height"
    @move="onMove"
    @board-created="(api) => (boardApi = api)"
  />
</template>

<script setup lang="ts">
import type { CmMoveEvent } from "~/types/types";

const props = defineProps<{
  puzzle: Puzzle;
}>();

const emit = defineEmits<{
  (e: "solved"): void;
  (e: "correct-move", move: string): void;
  (e: "incorrect-move", move: string): void;
}>();

defineShortcuts({
  ArrowLeft: () => {
    prevViewMove();
  },
  ArrowRight: () => {
    nextViewMove();
  },
});

const boardApi: Ref<ChessBoardAPI | null> = ref(null);

const state = ref<PuzzleBoardState>(jsonCopy(INITIAL_PUZZLE_BOARD_STATE));

const width = ref(700);
const height = ref(700);

const solutionMoves = computed(() => props.puzzle.moves.split(" "));
const solutionMovesMade = ref<string[]>([]);
const viewMovesMade = ref<string[]>([]);

const solutionMovesMadeStr = computed(() => solutionMovesMade.value.join(" "));
const viewMovesMadeStr = computed(() => viewMovesMade.value.join(" "));

const puzzleSolved = computed(
  () => solutionMovesMadeStr.value === props.puzzle.moves
);

// If the board is not showing the latest position or the puzzle has been solved, it should be in view-only mode
const isViewOnly = computed(() => {
  return (
    solutionMovesMadeStr.value !== viewMovesMadeStr.value || puzzleSolved.value
  );
});

onMounted(() => {
  boardApi.value?.resetBoard();
  boardApi.value?.setPosition(props.puzzle.fen);
  boardApi.value?.makeMove(solutionMoves.value[0]);

  state.value.nextToMove = boardApi.value?.getTurnColor() || "white";

  if (state.value.nextToMove === "black") {
    boardApi.value?.toggleOrientation();
  }
});

watch(
  () => props.puzzle,
  (puzzle) => {
    state.value = {
      status: "not_started",
      moveAttempts: [],
      hintUsed: false,
      nextToMove: boardApi.value?.getTurnColor() || "white",
    };

    solutionMovesMade.value = [];
    viewMovesMade.value = [];

    boardApi.value?.resetBoard();
    boardApi.value?.setPosition(puzzle.fen);
    boardApi.value?.makeMove(solutionMoves.value[0]);

    if (boardApi.value?.getTurnColor() === "black") {
      boardApi.value?.toggleOrientation();
    }
  }
);

const onMove = (move: CmMoveEvent) => {
  if (!solutionMovesMade.value.includes(move.lan)) {
    handleSolutionMove(move.lan);

    const isCheckmate = boardApi.value?.getIsCheckmate() || false;
    if (solutionMovesMadeStr.value === props.puzzle.moves || isCheckmate) {
      state.value.status = "finished";
      emit("solved");
    }
  }
};

const handleSolutionMove = (move: string) => {
  const expectedMove = solutionMoves.value[solutionMovesMade.value.length];
  const isCheckmate = boardApi.value?.getIsCheckmate() || false;
  const isCorrect = expectedMove === move || isCheckmate;

  // If it is a user-made-move, push to moveAttempts
  if (solutionMovesMade.value.length % 2 !== 0) {
    state.value.moveAttempts.push({ move, isCorrect });

    if (state.value.status === "not_started") {
      state.value.status = "in_progress";
    }
  }

  if (isCorrect) {
    emit("correct-move", move);

    solutionMovesMade.value.push(move);
    nextViewMove();

    // Auto-play opponent move if required
    if (
      solutionMovesMadeStr.value !== props.puzzle.moves &&
      solutionMovesMade.value.length % 2 === 0
    ) {
      setTimeout(() => {
        const replyMove = solutionMoves.value[solutionMovesMade.value.length];
        if (replyMove) {
          boardApi.value?.makeMove(replyMove);
        }
      }, 500);
    }
  } else {
    emit("incorrect-move", move);

    setTimeout(() => {
      boardApi.value?.undoLastMove();
    }, 500);
  }

  // Update whose turn it is
  state.value.nextToMove = boardApi.value?.getTurnColor() || "white";
};

const prevViewMove = () => {
  if (viewMovesMade.value.length === 0) return;

  const lastMove = viewMovesMade.value.pop();
  if (lastMove) {
    boardApi.value?.undoLastMove();
  }
};

const nextViewMove = () => {
  if (solutionMovesMadeStr.value === viewMovesMadeStr.value) return;

  const nextMove = solutionMovesMade.value[viewMovesMade.value.length];
  if (nextMove) {
    boardApi.value?.makeMove(nextMove);
    viewMovesMade.value.push(nextMove);
  }
};

defineExpose({
  state,
  nextViewMove,
  prevViewMove,
});
</script>
