// composables/useChessPuzzle.ts
import { ref, computed, watch } from "vue";
import type { Ref } from "vue";
import type { CmMoveEvent, PuzzleBoardState, ChessBoardAPI, Puzzle } from "~/types/types";
import { INITIAL_PUZZLE_BOARD_STATE, PlayerColor } from "~/types/types";
import { jsonCopy } from "~/utils/utils";
import { useChessSounds } from "~/composables/sounds";
import { MARKER_TYPE } from "~/utils/cm-chessboard/Markers.js";

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
  const sounds = useChessSounds();
  const isViewNavigating = ref(false);

  const solutionMovesMadeStr = computed(() =>
    solutionMovesMade.value.join(" ")
  );
  const viewMovesMadeStr = computed(() => viewMovesMade.value.join(" "));

  const puzzleSolved = computed(
    () => solutionMovesMadeStr.value === puzzle.value.moves
  );

  // Flag to track if enemy move is being played
  const isEnemyMoveInProgress = ref(false);

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

  const makeMove = async (lan: string, userMade = false) => {
    if (!boardApi.value) return;

    await boardApi.value.makeMove(lan);
    onMove(lanToCmMoveEvent(lan), userMade);
  };

  const resetBoard = async () => {
    // Reset state first (before any board updates to avoid flashing)
    solutionMovesMade.value = [];
    viewMovesMade.value = [];

    state.value = {
      status: "not_started",
      moveAttempts: [],
      hintUsed: false,
      nextToMove: PlayerColor.white,
    };

    // Clear all markers
    boardApi.value?.removeMarkers();

    // Set the position first to the puzzle FEN (without animation to avoid flash)
    boardApi.value?.setPosition(puzzle.value.fen, false);

    // Check who should move at the start of the puzzle (before playing first move)
    const initialTurnColor = boardApi.value?.getTurnColor();

    // Set orientation based on who moves at the start
    // If it's Black's turn, flip the board so Black is at the bottom
    if (initialTurnColor === PlayerColor.black) {
      boardApi.value?.setOrientation(PlayerColor.white);
    } else {
      boardApi.value?.setOrientation(PlayerColor.black);
    }

    // Wait a bit to ensure position is set before playing first move
    await new Promise(resolve => setTimeout(resolve, 50));

    // Now play the first forced move (this updates the internal chess state)
    if (solutionMoves.value[0]) {
      // Make the move directly on the board for the initial setup
      if (boardApi.value) {
        await boardApi.value.makeMove(solutionMoves.value[0]);
        // Add to both arrays to keep them in sync
        solutionMovesMade.value.push(solutionMoves.value[0]);
        viewMovesMade.value.push(solutionMoves.value[0]);
      }
    }

    // Update state with the turn color after the first move
    state.value.nextToMove = boardApi.value?.getTurnColor() || PlayerColor.white;
  };

  /* ------------------------------------------------------------------
   * Move handling
   * ------------------------------------------------------------------ */

  const onMove = async (move: CmMoveEvent, userMade = true) => {
    if (!solutionMovesMade.value.includes(move.lan)) {
      await handleSolutionMove(move.lan, userMade);

      const isCheckmate = boardApi.value?.getCheckmate() || false;
      if (solutionMovesMadeStr.value === puzzle.value.moves || isCheckmate) {
        state.value.status = "finished";
        sounds.playPuzzleSolved();
        emit("solved");
      }
    }
  };

  const handleSolutionMove = async (lan: string, userMade: boolean) => {
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
      if (userMade) {
        sounds.playCorrect();
        // User's move is already on the board, just add it to viewMovesMade
        viewMovesMade.value.push(lan);
        // Add tick marker to the destination square
        const { to } = lanToFromTo(lan);
        boardApi.value?.addMarker(MARKER_TYPE.tickCircle, to);
      }

      if (solutionMovesMadeStr.value !== puzzle.value.moves && userMade) {
        setTimeout(async () => {
          const reply = solutionMoves.value[solutionMovesMade.value.length];
          if (reply) {
            // Make the reply move directly on the board
            if (boardApi.value) {
              // Disable move input while playing enemy move
              isEnemyMoveInProgress.value = true;
              boardApi.value.disableMoveInput();
              
              // Clear tick/cross markers before making the reply move
              boardApi.value.removeMarkers(MARKER_TYPE.tickCircle);
              boardApi.value.removeMarkers(MARKER_TYPE.crossCircle);
              await boardApi.value.makeMove(reply);
              solutionMovesMade.value.push(reply);
              viewMovesMade.value.push(reply);
              
              // Re-enable move input after enemy move completes
              boardApi.value.enableMoveInput();
              isEnemyMoveInProgress.value = false;
            }
          }
        }, 500);
      }
    } else {
      emit("incorrect-move", lan);
      if (userMade) {
        sounds.playIncorrect();
        // Add cross marker to the destination square
        const { to } = lanToFromTo(lan);
        boardApi.value?.addMarker(MARKER_TYPE.crossCircle, to);
        // Remove the marker and undo the move after a delay
        setTimeout(() => {
          boardApi.value?.removeMarkers(MARKER_TYPE.crossCircle, to);
          boardApi.value?.undoLastMove();
        }, 750);
      } else {
        setTimeout(() => {
          boardApi.value?.undoLastMove();
        }, 750);
      }
    }

    state.value.nextToMove = boardApi.value?.getTurnColor() || PlayerColor.white;
  };

  /* ------------------------------------------------------------------
   * View navigation
   * ------------------------------------------------------------------ */

  const prevViewMove = async () => {
    // Prevent overlapping view navigation
    if (isViewNavigating.value) return;
    if (!viewMovesMade.value.length) return;

    isViewNavigating.value = true;
    try {
      viewMovesMade.value.pop();
      await boardApi.value?.undoLastMove();
    } finally {
      isViewNavigating.value = false;
    }
  };

  const nextViewMove = async () => {
    // Prevent overlapping view navigation
    if (isViewNavigating.value) return;

    // Only allow viewing moves that have already been made (are in solutionMovesMade)
    // Users shouldn't be able to scroll ahead to moves they haven't reached yet
    if (viewMovesMade.value.length >= solutionMovesMade.value.length) return;

    const next = solutionMovesMade.value[viewMovesMade.value.length];
    if (!next) return;

    isViewNavigating.value = true;
    try {
      // For view navigation, directly make the move without going through onMove
      // This only works for moves that are already in solutionMovesMade
      if (boardApi.value) {
        await boardApi.value.makeMove(next);
        viewMovesMade.value.push(next);
      }
    } finally {
      isViewNavigating.value = false;
    }
  };

  /* ------------------------------------------------------------------
   * Lifecycle
   * ------------------------------------------------------------------ */

  // Watch for puzzle changes and reset board when puzzle changes
  watch(puzzle, async () => {
    if (boardApi.value) {
      await resetBoard();
    }
  }, { immediate: true });

  // Watch for boardApi to become available and reset board if puzzle is already set
  watch(boardApi, async () => {
    if (boardApi.value && puzzle.value) {
      await resetBoard();
    }
  });

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
