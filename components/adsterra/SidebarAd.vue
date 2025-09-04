<template>
  <!-- The ad will be injected here -->
  <div ref="adContainer" class="ad-banner"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const adContainer = ref(null);

onMounted(() => {
  if (adContainer.value) {
    // Create the inline options script
    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.innerHTML = `
      atOptions = {
        key: "3df3b0422b85ffa401bf92deeea3ef8d",
        format: "iframe",
        height: 600,
        width: 160,
        params: {},
      };
    `;

    // Create the external script
    const externalScript = document.createElement("script");
    externalScript.type = "text/javascript";
    externalScript.src =
      "//www.highperformanceformat.com/3df3b0422b85ffa401bf92deeea3ef8d/invoke.js";

    // Append both scripts to the container
    adContainer.value.appendChild(optionsScript);
    adContainer.value.appendChild(externalScript);
  }
});
</script>

<style scoped>
.ad-banner {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}
</style>
