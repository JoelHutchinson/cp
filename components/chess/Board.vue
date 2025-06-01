<template>
  <UiResizableContainer
    v-model:width="width"
    v-model:height="height"
    :min-width="300"
    :min-height="300"
    :max-width="600"
    :max-height="600"
    :step="4"
    lock-aspect-ratio
  >
    <TheChessboard
      :board-config="boardConfig"
      @move="handleMove"
      @board-created="handleBoardCreated"
      :style="{ width: `${width}px`, height: `${height}px` }"
      reactive-config
    />
  </UiResizableContainer>
</template>

<script setup lang="ts">
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";

import type { BoardApi, BoardConfig, MoveEvent } from "vue3-chessboard";
import type { Reactive } from "vue";

const vue3ChessboardApi: Ref<BoardApi | null> = ref(null);
const boardApi: Ref<ChessBoardAPI | null> = ref(null);

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

// Get current window width dynamically
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

const maxBoardWidth = computed(() => Math.max(200, windowWidth.value - 200));

watch(windowWidth, () => {
  if (width.value > maxBoardWidth.value) {
    width.value = maxBoardWidth.value;
    height.value = maxBoardWidth.value;
  }
});

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
  };
  emit("boardCreated", boardApi.value);
};

// Chess Board API methods
const setPosition = (fen: string) => {
  if (vue3ChessboardApi.value) {
    vue3ChessboardApi.value.setPosition(fen);
  }
};

const makeMove = (move: string) => {
  if (vue3ChessboardApi.value) {
    vue3ChessboardApi.value.move(move);
  }
};

const resetBoard = () => {
  if (vue3ChessboardApi.value) {
    vue3ChessboardApi.value.resetBoard();
  }
};

const clearBoard = () => {
  if (vue3ChessboardApi.value) {
    vue3ChessboardApi.value.clearBoard();
  }
};

const undoLastMove = () => {
  if (vue3ChessboardApi.value) {
    vue3ChessboardApi.value.undoLastMove();
  }
};

// Watchers
watch(
  () => props.viewOnly,
  (viewOnly) => {
    boardConfig.viewOnly = viewOnly;
  }
);
</script>
