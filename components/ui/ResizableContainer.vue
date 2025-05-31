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
        name="i-heroicons-arrows-pointing-out"
        class="size-3 mr-2 mb-2 text-primary-500 dark:text-primary-400"
      />
    </div>
  </UCard>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  width: { type: Number, default: 200 },
  height: { type: Number, default: 150 },
  lockAspectRatio: { type: Boolean, default: false },
});

const emit = defineEmits(["update:width", "update:height"]);

const width = ref(props.width);
const height = ref(props.height);

const extraWidth = 20;
const extraHeight = 20;

let aspectRatio = width.value / height.value;

const startResize = (e) => {
  if (typeof window === "undefined") return;

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = width.value;
  const startHeight = height.value;

  // Capture aspect ratio at drag start
  if (props.lockAspectRatio) {
    aspectRatio = startWidth / startHeight;
  }

  const onMouseMove = (e) => {
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

    width.value = Math.max(50, Math.round(newWidth));
    height.value = Math.max(50, Math.round(newHeight));
    emit("update:width", width.value);
    emit("update:height", height.value);
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
  justify-content: center; /* horizontal centering */
  align-items: center; /* vertical centering */
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
