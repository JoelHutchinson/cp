<template>
  <ClientOnly>
    <div :class="['odometer', theme, '!font-sans']" ref="el" v-bind="$attrs">
      {{ value }}
    </div>
  </ClientOnly>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import "odometer/themes/odometer-theme-default.css";

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    default: "odometer-theme-default",
  },
});

const el = ref(null);
let od;

onMounted(async () => {
  const { default: Odometer } = await import("odometer");
  od = new Odometer({
    el: el.value,
    value: props.value,
  });
  od.render();
});

watch(
  () => props.value,
  (newVal) => {
    if (od) od.update(newVal);
  }
);
</script>
