<template>
  <TheChessboard
    :board-config="boardConfig"
    @move="handleMove"
    @board-created="handleBoardCreated"
    style="width: 100%; height: 100%"
    reactive-config
  />
</template>

<script setup lang="ts">
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";

import type { BoardApi, BoardConfig, MoveEvent } from "vue3-chessboard";
import type { Reactive } from "vue";

const props = defineProps<{
  viewOnly: boolean;
}>();

const emit = defineEmits<{
  (e: "boardCreated", boardApi: ChessBoardAPI): void;
  (e: "move", move: MoveEvent): void;
}>();

const boardConfig: Reactive<BoardConfig> = reactive({
  viewOnly: props.viewOnly,
  coordinates: true,
  autoCastle: true,
  orientation: "white",
  drawable: {
    enabled: true,
    visible: true,
    defaultSnapToValidMove: true,
    eraseOnClick: true,
    shapes: [],
    autoShapes: [],
    brushes: {
      green: { key: "g", color: "#15781B", opacity: 1, lineWidth: 10 },
      red: { key: "r", color: "#882020", opacity: 1, lineWidth: 10 },
      blue: { key: "b", color: "#003088", opacity: 1, lineWidth: 10 },
      yellow: { key: "y", color: "#e68f00", opacity: 1, lineWidth: 10 },
      paleBlue: { key: "pb", color: "#003088", opacity: 0.4, lineWidth: 15 },
      paleGreen: { key: "pg", color: "#15781B", opacity: 0.4, lineWidth: 15 },
      paleRed: { key: "pr", color: "#882020", opacity: 0.4, lineWidth: 15 },
      paleGrey: {
        key: "pgr",
        color: "#4a4a4a",
        opacity: 0.35,
        lineWidth: 15,
      },
    },
  },
});

const vue3ChessboardApi: Ref<BoardApi | null> = ref(null);
const boardApi: Ref<ChessBoardAPI | null> = ref(null);

const handleMove = (move: MoveEvent) => {
  emit("move", move);
};

const handleBoardCreated = (newBoardApi: BoardApi) => {
  vue3ChessboardApi.value = newBoardApi;

  boardApi.value = {
    setPosition,
    makeMove,
    resetBoard,
    clearBoard,
    undoLastMove,
    toggleOrientation,
    getTurnColor,
    getIsCheckmate,
  };

  emit("boardCreated", boardApi.value);
};

// Chessboard API
const setPosition = (fen: string) => vue3ChessboardApi.value?.setPosition(fen);
const makeMove = (move: string) => vue3ChessboardApi.value?.move(move);
const resetBoard = () => vue3ChessboardApi.value?.resetBoard();
const clearBoard = () => vue3ChessboardApi.value?.clearBoard();
const undoLastMove = () => vue3ChessboardApi.value?.undoLastMove();
const toggleOrientation = () => vue3ChessboardApi.value?.toggleOrientation();
const getTurnColor = () => vue3ChessboardApi.value?.getTurnColor() || "white";
const getIsCheckmate = () => vue3ChessboardApi.value?.getIsCheckmate() || false;

watch(
  () => props.viewOnly,
  (viewOnly) => {
    boardConfig.viewOnly = viewOnly;
  }
);
</script>
