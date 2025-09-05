import { ref, onMounted, onBeforeUnmount } from "vue";

export type ScreenSize = "mobile" | "tablet" | "desktop" | "xl";

export function useScreenSize() {
  const screenSize = ref<ScreenSize>("desktop");

  function updateScreenSize() {
    const width = window.innerWidth;
    if (width < 640) screenSize.value = "mobile"; // Tailwind: <sm
    else if (width < 1024) screenSize.value = "tablet"; // sm–md
    else if (width < 1280) screenSize.value = "desktop"; // lg
    else screenSize.value = "xl"; // xl+
  }

  onMounted(() => {
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateScreenSize);
  });

  return { screenSize };
}
