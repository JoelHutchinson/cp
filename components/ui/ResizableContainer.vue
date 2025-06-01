<template>
  <UCard
    class="resizable"
    :style="{
      width: width + extraWidth + 'px',
      height: height + extraHeight + 'px',
    }"
    :ui="{
      base: 'flex items-center justify-center',
      body: { padding: 'px-0 py-0 m-0 sm:p-0' },
    }"
  >
    <div
      class="content flex items-center justify-center"
      :style="{ width: width + 'px', height: height + 'px' }"
    >
      <slot />
    </div>
    <div class="resizer" @mousedown="startResize">
      <UIcon
        name="mdi-drag-variant"
        class="size-3 mr-2 mb-2 text-gray-500 dark:text-gray-400"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  lockAspectRatio: { type: Boolean, default: false },
  step: { type: Number, default: 5 },
  minWidth: { type: Number, default: 50 },
  maxWidth: { type: Number, default: Infinity },
  minHeight: { type: Number, default: 50 },
  maxHeight: { type: Number, default: Infinity },
});

const width = defineModel<number>("width", { default: 600, required: true });
const height = defineModel<number>("height", { default: 600 });

const emit = defineEmits(["update:width", "update:height"]);

const extraWidth = 20;
const extraHeight = 20;

let aspectRatio = width.value / height.value;

const roundToStep = (value: number, step: number) =>
  Math.round(value / step) * step;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const startResize = (e: MouseEvent) => {
  if (typeof window === "undefined") return;

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = width.value;
  const startHeight = height.value;

  if (props.lockAspectRatio) {
    aspectRatio = startWidth / startHeight;
  }

  const onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth + dx;
    let newHeight = startHeight + dy;

    if (props.lockAspectRatio) {
      if (Math.abs(dx) > Math.abs(dy)) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }
    }

    const steppedWidth = roundToStep(newWidth, props.step);
    const steppedHeight = roundToStep(newHeight, props.step);

    width.value = clamp(steppedWidth, props.minWidth, props.maxWidth);
    height.value = clamp(steppedHeight, props.minHeight, props.maxHeight);
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};
</script>

<style scoped>
.resizable {
  position: relative;
  padding: 10px;
  box-sizing: content-box;
}

.content {
  background: white;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.resizer {
  width: 12px;
  height: 12px;
  position: absolute;
  right: 4px;
  bottom: 4px;
  cursor: se-resize;
  z-index: 10;
}
</style>
