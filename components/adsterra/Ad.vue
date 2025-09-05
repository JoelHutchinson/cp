<template>
  <!-- Outer wrapper where scripts are injected -->
  <div ref="adRef"></div>
  <!-- Inner container where Adsterra paints the ad -->
  <div :id="containerId" class="flex items-center justify-center"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";

interface Props {
  adslot: string;
  refreshInterval?: number; // ms, default 60000 (60s)
}

const props = withDefaults(defineProps<Props>(), {
  refreshInterval: 60000,
});

const adRef = ref<HTMLElement | null>(null);
const isAdVisible = ref(false);
let refreshTimer: number | null = null;
let isTabVisible = true;
let observer: IntersectionObserver | null = null;

const containerId = computed(() => `atContainer-${props.adslot}`);

const loadAd = () => {
  if (!adRef.value || !props.adslot) return;

  // Clear old ad scripts
  adRef.value.innerHTML = "";

  const atAsyncOptions = {
    key: props.adslot,
    format: "js",
    async: true,
    container: containerId.value,
    params: {},
  };

  const conf = document.createElement("script");
  conf.type = "text/javascript";
  conf.innerHTML = `
    if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
    atAsyncOptions.push(${JSON.stringify(atAsyncOptions, null, 2)});
  `;

  const script = document.createElement("script");
  script.async = true;
  script.src = `//www.highperformanceformat.com/${props.adslot}/invoke.js`;
  script.type = "text/javascript";

  adRef.value.appendChild(conf);
  adRef.value.appendChild(script);
};

const startRefresh = () => {
  if (props.refreshInterval && props.refreshInterval > 0) {
    refreshTimer = window.setInterval(() => {
      if (isTabVisible && isAdVisible.value) {
        loadAd();
      }
    }, props.refreshInterval);
  }
};

const stopRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

onMounted(() => {
  loadAd();
  startRefresh();

  // Track tab focus
  document.addEventListener("visibilitychange", () => {
    isTabVisible = !document.hidden;
  });

  // Track ad element visibility
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isAdVisible.value = entry.isIntersecting;
      });
    },
    { threshold: 0.5 } // visible at least 50%
  );

  if (adRef.value) observer.observe(adRef.value);
});

watch(() => props.adslot, loadAd);

onBeforeUnmount(() => {
  stopRefresh();
  if (observer && adRef.value) observer.unobserve(adRef.value);
});
</script>
