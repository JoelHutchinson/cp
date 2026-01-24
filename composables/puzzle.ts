// composables/useChessPuzzle.ts
import { ref, computed, watch } from "vue";
import type { Ref } from "vue";
import type { CmMoveEvent, PuzzleBoardState, ChessBoardAPI, Puzzle } from "~/types/types";
import { INITIAL_PUZZLE_BOARD_STATE, PlayerColor } from "~/types/types";
import { jsonCopy } from "~/utils/utils";

export function useChessPuzzle(
  puzzle: Ref<Puzzle>,
  boardApi: Ref<ChessBoardAPI | null>,
  emit: (
    event: "solved" | "correct-move" | "incorrect-move",
    move?: string
  ) => void
) {
  /* ------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------ */

  const state = ref<PuzzleBoardState>(jsonCopy(INITIAL_PUZZLE_BOARD_STATE));

  const solutionMoves = computed(() => puzzle.value.moves.split(" "));
  const solutionMovesMade = ref<string[]>([]);
  const viewMovesMade = ref<string[]>([]);

  const solutionMovesMadeStr = computed(() =>
    solutionMovesMade.value.join(" ")
  );
  const viewMovesMadeStr = computed(() => viewMovesMade.value.join(" "));

  const puzzleSolved = computed(
    () => solutionMovesMadeStr.value === puzzle.value.moves
  );

  const isViewOnly = computed(() => {
    return (
      solutionMovesMadeStr.value !== viewMovesMadeStr.value ||
      puzzleSolved.value
    );
  });

  /* ------------------------------------------------------------------
   * Move format utilities
   * ------------------------------------------------------------------ */

  const lanToFromTo = (lan: string) => ({
    from: lan.slice(0, 2),
    to: lan.slice(2, 4),
  });

  const lanToCmMoveEvent = (lan: string): CmMoveEvent => {
    const { from, to } = lanToFromTo(lan);
    return {
      lan,
      from,
      to,
      color: boardApi.value?.getTurnColor() === PlayerColor.white ? PlayerColor.black : PlayerColor.white,
    };
  };

  /* ------------------------------------------------------------------
   * Core board helpers
   * ------------------------------------------------------------------ */

  const makeMove = (lan: string, userMade = false) => {
    if (!boardApi.value) return;

    boardApi.value.makeMove(lan);
    onMove(lanToCmMoveEvent(lan), userMade);
  };

  const resetBoard = () => {
    // Reset state first (before any board updates to avoid flashing)
    solutionMovesMade.value = [];
    viewMovesMade.value = [];

    state.value = {
      status: "not_started",
      moveAttempts: [],
      hintUsed: false,
      nextToMove: PlayerColor.white,
    };

    // Set the position first to the puzzle FEN
    boardApi.value?.setPosition(puzzle.value.fen);

    // Check who should move at the start of the puzzle (before playing first move)
    const initialTurnColor = boardApi.value?.getTurnColor();

    // Set orientation based on who moves at the start
    // If it's Black's turn, flip the board so Black is at the bottom
    if (initialTurnColor === PlayerColor.black) {
      boardApi.value?.setOrientation(PlayerColor.white);
    } else {
      boardApi.value?.setOrientation(PlayerColor.black);
    }

    // Now play the first forced move (this updates the internal chess state)
    if (solutionMoves.value[0]) {
      makeMove(solutionMoves.value[0], false);
    }

    // Update state with the turn color after the first move
    state.value.nextToMove = boardApi.value?.getTurnColor() || PlayerColor.white;
  };

  /* ------------------------------------------------------------------
   * Move handling
   * ------------------------------------------------------------------ */

  const onMove = (move: CmMoveEvent, userMade = true) => {
    if (!solutionMovesMade.value.includes(move.lan)) {
      handleSolutionMove(move.lan, userMade);

      const isCheckmate = boardApi.value?.getCheckmate() || false;
      if (solutionMovesMadeStr.value === puzzle.value.moves || isCheckmate) {
        state.value.status = "finished";
        emit("solved");
      }
    }
  };

  const handleSolutionMove = (lan: string, userMade: boolean) => {
    const expectedMove = solutionMoves.value[solutionMovesMade.value.length];
    const isCheckmate = boardApi.value?.getCheckmate() || false;
    const isCorrect = lan === expectedMove || isCheckmate;

    if (userMade) {
      state.value.moveAttempts.push({ move: lan, isCorrect });
      if (state.value.status === "not_started") {
        state.value.status = "in_progress";
      }
    }

    if (isCorrect) {
      emit("correct-move", lan);
      solutionMovesMade.value.push(lan);

      if (userMade) nextViewMove();

      if (solutionMovesMadeStr.value !== puzzle.value.moves && userMade) {
        setTimeout(() => {
          const reply = solutionMoves.value[solutionMovesMade.value.length];
          if (reply) makeMove(reply, false);
        }, 500);
      }
    } else {
      emit("incorrect-move", lan);
      setTimeout(() => {
        boardApi.value?.undoLastMove();
      }, 500);
    }

    state.value.nextToMove = boardApi.value?.getTurnColor() || PlayerColor.white;
  };

  /* ------------------------------------------------------------------
   * View navigation
   * ------------------------------------------------------------------ */

  const prevViewMove = () => {
    if (!viewMovesMade.value.length) return;
    viewMovesMade.value.pop();
    boardApi.value?.undoLastMove();
  };

  const nextViewMove = () => {
    if (solutionMovesMadeStr.value === viewMovesMadeStr.value) return;
    const next = solutionMoves.value[viewMovesMade.value.length];
    if (!next) return;

    makeMove(next, false);
    viewMovesMade.value.push(next);
  };

  /* ------------------------------------------------------------------
   * Lifecycle
   * ------------------------------------------------------------------ */

  watch(puzzle, resetBoard, { immediate: true });

  return {
    // state
    state,
    isViewOnly,
    puzzleSolved,

    // handlers
    onMove,
    makeMove,

    // view controls
    nextViewMove,
    prevViewMove,

    // utilities
    lanToFromTo,
    lanToCmMoveEvent,
  };
}
