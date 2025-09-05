<template>
  <!-- Outer wrapper that will be cleared/reloaded -->
  <div ref="adRef"></div>
  <div :id="containerId" class="flex items-center justify-center"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";

interface Props {
  adslot: string;
  refreshInterval?: number; // in ms, e.g. 30000 for 30s
}

const props = defineProps<Props>();

const adRef = ref<HTMLElement | null>(null);
let refreshTimer: number | null = null;

const containerId = computed(() => `atContainer-${props.adslot}`);

const loadAd = () => {
  if (!adRef.value || !props.adslot) return;

  // Clear any previous content
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

onMounted(() => {
  loadAd();

  // Optional auto-refresh
  if (props.refreshInterval && props.refreshInterval > 0) {
    refreshTimer = window.setInterval(() => {
      loadAd();
    }, props.refreshInterval);
  }
});

watch(() => props.adslot, loadAd);

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script>
