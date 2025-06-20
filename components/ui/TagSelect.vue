<template>
  <div class="flex flex-wrap gap-2">
    <UButton
      v-for="option in options"
      :color="selected.includes(option[valueAttribute]) ? 'primary' : 'gray'"
      variant="soft"
      size="2xs"
      class="transition"
      @click="toggleOption(option[valueAttribute])"
    >
      {{ option[optionAttribute] }}
    </UButton>
  </div>
</template>

<script setup lang="ts" generic="Option, ValueKey extends keyof Option">
const selected = defineModel<Option[ValueKey][]>({
  required: true,
});

defineProps<{
  options: Option[];
  optionAttribute: keyof Option;
  valueAttribute: ValueKey;
}>();

const toggleOption = (value: Option[ValueKey]) => {
  if (selected.value.includes(value)) {
    selected.value.splice(selected.value.indexOf(value), 1);
  } else selected.value.push(value);
};
</script>
