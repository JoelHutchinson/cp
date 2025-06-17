<template>
  <UModal v-model="isOpen">
    <form>
      <UCard
        :ui="{
          header: { base: 'flex justify-between' },
          body: { base: 'flex flex-col gap-4' },
          footer: { base: 'grid grid-cols-2 gap-4' },
          ...cardUi,
        }"
      >
        <template #header>
          <UiHeading class="capitalize">{{ title }}</UiHeading>

          <div class="flex items-center gap-1">
            <slot name="header-actions"></slot>
          </div>
        </template>

        <slot></slot>

        <template #footer>
          <UButton color="white" @click="isOpen = false" block>
            Cancel
          </UButton>

          <UButton
            :loading="loading"
            :color="buttonColor"
            @click="$emit('action', $event)"
            block
            class="capitalize"
          >
            {{ buttonText }}
          </UButton>
        </template>
      </UCard>
    </form>
  </UModal>
</template>

<script setup lang="ts">
import type { ButtonColor } from "#ui/types";

const isOpen = defineModel<boolean>({ required: true });

defineProps<{
  title: string;
  buttonText: string;
  buttonColor?: ButtonColor;
  cardUi?: any;
  loading: boolean;
}>();

defineEmits<{
  (e: "action", event: Event): void;
}>();
</script>
