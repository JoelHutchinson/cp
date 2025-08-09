<template>
  <UButton :padded="false" variant="link" :to="linkUrl" target="_blank">
    <slot></slot>
    <UTooltip
      :ui="{
        base: '!text-clip min-h-full h-fit w-fit',
      }"
    >
      <template #text>
        <span>
          This is an Amazon affiliate link, I earn a commission on purchases
          through this link.
        </span>
      </template>

      <UBadge size="xs">Affiliate Link</UBadge>
    </UTooltip>
  </UButton>
</template>

<script setup lang="ts">
defineProps<{
  linkUrl: string;
}>();
</script>
