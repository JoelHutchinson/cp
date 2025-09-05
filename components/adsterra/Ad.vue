<template>
  <div ref="adRef"></div>
  <div :id="containerId"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";

interface Props {
  adslot: string;
}

const props = defineProps<Props>();

const adRef = ref<HTMLElement | null>(null);

const containerId = computed(() => `atContainer-${props.adslot}`);

const loadAd = () => {
  if (!adRef.value || !props.adslot || adRef.value.firstChild) return;

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

onMounted(loadAd);

// Optional: reload if slot prop changes dynamically
watch(() => props.adslot, loadAd);
</script>
