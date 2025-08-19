<template>
  <UTooltip
    :ui="{
      base: '!text-clip min-h-full h-fit w-fit',
    }"
  >
    <template #text>
      <slot name="text"></slot>
    </template>

    <slot></slot>
  </UTooltip>
</template>
