<template>
  <div ref="boardEl" id="board" style="width: 100%; height: 100%" />
</template>

<script setup lang="ts">
import { Chessboard, FEN, INPUT_EVENT_TYPE, COLOR } from "cm-chessboard";
import { Markers } from "~/utils/cm-chessboard/Markers.js"
import { PromotionDialog } from "~/utils/cm-chessboard/PromotionDialog.js"
import { RightClickAnnotator } from "~/utils/cm-chessboard/RightClickAnnotator.js"

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

// Store pending promotion move info
let pendingPromotionMove: { from: string; to: string } | null = null;

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
    extensions: [{ class: Markers }, { class: PromotionDialog }, { class: RightClickAnnotator }],
    style: { pieces: { file: "pieces/standard.svg" }, animationDuration: 500 }
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

      // Remove all arrows
      board?.removeArrows();
      board?.removeMarkers();
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

        // Check if this is a promotion move
        const isPromotionMove = isMoveLegal &&
          (squareTo.charAt(1) === "8" || squareTo.charAt(1) === "1") &&
          event.piece.charAt(1) === "p";

        if (isPromotionMove) {
          // Store the move info for later processing
          pendingPromotionMove = { from: squareFrom, to: squareTo };
        } else {
          pendingPromotionMove = null;
        }

        return isMoveLegal;
      } catch (error) {
        return false;
      }

    case INPUT_EVENT_TYPE.moveInputCanceled:
      // Clear pending promotion move if move is canceled
      pendingPromotionMove = null;
      return;

    case INPUT_EVENT_TYPE.moveInputFinished:
      const { squareFrom: from, squareTo: to } = event;

      // Check if this is a promotion move
      if (pendingPromotionMove && pendingPromotionMove.from === from && pendingPromotionMove.to === to) {
        // Get the piece color from the current turn
        const pieceColor = chess.turn() === "w" ? "w" : "b";

        // Show promotion dialog and wait for user selection
        board?.showPromotionDialog(to, pieceColor, (result: any) => {
          if (result && result.type === "pieceSelected" && result.piece) {
            // Extract promotion piece letter (q, r, b, n) from piece string (e.g., "wq" -> "q")
            const promotionPiece = result.piece.charAt(1);

            try {
              // Apply the move with the selected promotion piece
              const moveResult = chess.move({
                from,
                to,
                promotion: promotionPiece,
              });

              if (moveResult) {
                // Update board to reflect the new position
                board?.setPosition(chess.fen());

                const lan = moveResult.lan;

                emit("move", {
                  lan,
                  from,
                  to,
                  color: moveResult.color === "w" ? "white" : "black",
                });
              }
            } catch (error) {
              // If move fails, revert board position
              board?.setPosition(chess.fen());
            }
          } else {
            // User canceled - revert the board position
            board?.setPosition(chess.fen());
          }

          // Clear pending promotion move
          pendingPromotionMove = null;
        });

        // Return true to indicate the move input is being handled
        return true;
      }

      // Regular (non-promotion) move
      let result;

      try {
        // Now actually apply the move to chess.js
        result = chess.move({
          from,
          to,
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
