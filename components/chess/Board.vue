<template>
  <TheChessboard
    :board-config="boardConfig"
    @move="handleMove"
    @board-created="handleBoardCreated"
    :style="{ width: `${currentWidth}px`, height: `${currentHeight}px` }"
    reactive-config
  />
</template>

<script setup lang="ts">
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";

import type { BoardApi, BoardConfig, MoveEvent } from "vue3-chessboard";
import type { Reactive } from "vue";

import { useWindowSize, useBreakpoints } from "@vueuse/core";

const { width: windowWidth } = useWindowSize();

const breakpoints = useBreakpoints({
  sm: 520,
  md: 768,
  lg: 1024,
  xl: 1280,
});

const deviceType = computed(() => {
  if (breakpoints.greater("lg").value) return "desktop";
  if (breakpoints.greater("sm").value) return "tablet";
  return "mobile";
});

const width = defineModel<number>("width", { default: 600, required: true });
const height = defineModel<number>("height", { default: 600, required: true });

const props = defineProps<{
  viewOnly: boolean;
  width: number;
  height: number;
}>();

const emit = defineEmits<{
  (e: "boardCreated", boardApi: ChessBoardAPI): void;
  (e: "move", move: MoveEvent): void;
}>();

const boardConfig: Reactive<BoardConfig> = reactive({
  viewOnly: false,
  coordinates: true,
  autoCastle: false,
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

const maxBoardWidth = computed(() => {
  switch (deviceType.value) {
    case "desktop":
      return 600;
    case "tablet":
      return 400;
    case "mobile":
      return windowWidth.value;
    default:
      return 600;
  }
});

const currentWidth = computed(() => {
  switch (deviceType.value) {
    case "desktop":
      return maxBoardWidth.value;
    case "tablet":
    case "mobile":
      return maxBoardWidth.value;
    default:
      return width.value;
  }
});
const currentHeight = computed(() => currentWidth.value);

watch([windowWidth, deviceType], () => {
  const newSize = maxBoardWidth.value;
  if (width.value > newSize) {
    width.value = newSize;
    height.value = newSize;
  }
});

onMounted(() => {
  const newSize = maxBoardWidth.value;
  width.value = newSize;
  height.value = newSize;
});

// Emitters
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

watch(
  () => props.viewOnly,
  (viewOnly) => {
    boardConfig.viewOnly = viewOnly;
  }
);
</script>
