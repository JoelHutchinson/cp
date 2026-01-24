<template>
  <div ref="boardEl" id="board" style="width: 100%; height: 100%" />
</template>

<script setup lang="ts">
import { Chessboard, FEN, INPUT_EVENT_TYPE, COLOR } from "cm-chessboard";
import { Chess } from "chess.js";
import type { ChessBoardAPI } from "~/types/types";
import { PlayerColor } from "~/types/types";

const props = defineProps<{
  viewOnly: boolean;
}>();

const emit = defineEmits<{
  (e: "boardCreated", api: ChessBoardAPI): void;
  (e: "move", move: CmMoveEvent): void;
}>();

export type CmMoveEvent = {
  lan: string;
  from: string;
  to: string;
  color: "white" | "black";
};

const boardEl = ref<HTMLElement | null>(null);
let board: Chessboard | null = null;
const chess = new Chess();

// *** Internal mapping between cm-chessboard COLOR and PlayerColor ***
// This keeps the component self-contained and allows easy library switching
const colorToPlayerColor = (color: typeof COLOR[keyof typeof COLOR]): PlayerColor => {
  return color === COLOR.white ? PlayerColor.white : PlayerColor.black;
};

const playerColorToColor = (color: PlayerColor): typeof COLOR[keyof typeof COLOR] => {
  return color === PlayerColor.white ? COLOR.white : COLOR.black;
};

// *** Lifecycle ***
onMounted(() => {
  if (!boardEl.value) return;

  board = new Chessboard(boardEl.value, {
    position: FEN.start,
    assetsUrl: "/cm-chessboard/assets/",
    viewOnly: props.viewOnly,
  });

  if (!props.viewOnly) {
    board.enableMoveInput(onUserMove, undefined);
  }

  emit("boardCreated", boardApi);
});

onBeforeUnmount(() => {
  board?.destroy();
  board = null;
});

// *** Handle user move ***
function onUserMove(event: any) {
  switch (event.type) {
    case INPUT_EVENT_TYPE.moveInputStarted:
      // Accept initial click/drag
      return true;

    case INPUT_EVENT_TYPE.validateMoveInput:
      // Validate the move BEFORE it's applied to the board
      // event.squareFrom & event.squareTo have squares like "e2"/"e4"
      const { squareFrom, squareTo } = event;

      try {
        // Try the move on a temporary state to validate without committing
        const legalMoves = chess.moves({ square: squareFrom, verbose: true });
        const isMoveLegal = legalMoves.some(
          (move: any) => move.to === squareTo
        );

        // Return true to allow the visual move, false to cancel it
        return isMoveLegal;
      } catch (error) {
        return false;
      }

    case INPUT_EVENT_TYPE.moveInputCanceled:
      return;

    case INPUT_EVENT_TYPE.moveInputFinished:
      const { squareFrom: from, squareTo: to } = event;

      let result;

      try {
        // Now actually apply the move to chess.js
        result = chess.move({
          from,
          to,
          promotion: "q",
        });
      } catch (error) {
        return false;
      }

      // Double-check move was successful (should be, since we validated)
      if (!result) {
        return false;
      }

      // Update board to reflect the new position
      board?.setPosition(chess.fen());

      const lan = result.lan;

      emit("move", {
        lan,
        from,
        to,
        color: result.color === "w" ? "white" : "black",
      });

      return true;
  }

  return true;
}

// *** Exposed API for parent ***
const boardApi: ChessBoardAPI = {
  setPosition(fen: string) {
    chess.load(fen);
    board?.setPosition(fen);
  },

  makeMove(move: string) {
    let result;
    try {
      result = chess.move(move);
    } catch (error) {
      return undefined;
    }

    if (!result) return undefined;
    board?.setPosition(chess.fen());
    return move;
  },

  resetBoard() {
    chess.reset();
    board?.setPosition(FEN.start);
  },

  clearBoard() {
    chess.clear();
    board?.setPosition("8/8/8/8/8/8/8/8");
  },

  undoLastMove() {
    const undone = chess.undo();
    if (undone) {
      board?.setPosition(chess.fen());
    }
  },

  toggleOrientation() {
    const current = board?.getOrientation();
    const nextOrientation = current === COLOR.white ? COLOR.black : COLOR.white;
    board?.setOrientation(nextOrientation);
  },

  setOrientation(color: PlayerColor) {
    const cmColor = playerColorToColor(color);
    board?.setOrientation(cmColor);
  },

  getTurnColor() {
    return chess.turn() === "w" ? PlayerColor.white : PlayerColor.black;
  },

  getCheckmate() {
    return chess.isCheckmate();
  },
};
</script>
