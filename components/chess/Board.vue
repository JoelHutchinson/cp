<template>
  <div ref="boardEl" id="board" style="width: 100%; height: 100%" />
</template>

<script setup lang="ts">
import { Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard";
import { Chess } from "chess.js";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

// Define a clean Move type
export type CmMoveEvent = {
  lan: string;
  from: string;
  to: string;
  color: "white" | "black";
};

const props = defineProps<{
  viewOnly: boolean;
}>();

const emit = defineEmits<{
  (e: "boardCreated", api: ChessBoardAPI): void;
  (e: "move", move: CmMoveEvent): void;
}>();

const boardEl = ref<HTMLElement | null>(null);
let board: Chessboard | null = null;
const chess = new Chess();

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

watch(
  () => props.viewOnly,
  (viewOnly) => {
    board?.setViewOnly(viewOnly);
  }
);

// *** Handle user move ***
function onUserMove(event: any) {
  switch (event.type) {
    case INPUT_EVENT_TYPE.validateMoveInput:
      // event.squareFrom & event.squareTo have squares like "e2"/"e4"
      // Return true so the board visually moves the piece
      return true;

    case INPUT_EVENT_TYPE.moveInputStarted:
      // Accept initial click/drag
      return true;

    case INPUT_EVENT_TYPE.moveInputCanceled:
      return;

    case INPUT_EVENT_TYPE.moveInputFinished:
      const { squareFrom, squareTo } = event;

      console.log("BEFORE UPDATING INTERNAL STATE", chess.fen());

      const result = chess.move({
        from: squareFrom,
        to: squareTo,
        // promotion: "q",
      });

      // If move is illegal, cancel it
      if (!result) {
        // returning false undoes UI move
        return false;
      }

      console.log("BEFORE UPDATING UI STATE", chess.fen());

      // Update board position
      board?.setPosition(chess.fen());

      const lan = result.lan;

      emit("move", {
        lan,
        from: squareFrom,
        to: squareTo,
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
    const result = chess.move(move);

    if (!result) return;
    board?.setPosition(chess.fen());
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
    board?.setOrientation(current === "white" ? "black" : "white");
  },

  getTurnColor() {
    return chess.turn() === "w" ? "white" : "black";
  },

  getIsCheckmate() {
    return chess.isCheckmate();
  },
};
</script>
