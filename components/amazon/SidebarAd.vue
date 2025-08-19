<template>
  <UCarousel
    ref="carouselRef"
    v-slot="{ item }"
    :items="AMAZON_BOOKS"
    :ui="{
      item: 'basis-full',
      container: 'h-full',
      background: 'bg-white dark:bg-black/10',
      // ring: 'ring-0',
      rounded: 'rounded-none',
    }"
    class="overflow-hidden h-full pb-8 ring-1 ring-gray-200 dark:ring-gray-800 border-gray-800 dark:bg-black/10 bg-white"
    indicators
  >
    <div
      class="flex flex-col h-full items-center p-4 text-center justify-between dark:bg-black/10"
    >
      <div class="flex flex-col items-center select-none">
        <img
          :src="item.image"
          alt="Book cover"
          class="w-auto h-auto max-w-52 object-cover rounded shadow mb-4"
        />
        <h3 class="font-bold text-lg mb-0.5">{{ item.title }}</h3>
        <UiTypography class="text-sm mb-3">by {{ item.author }}</UiTypography>

        <UiTypography class="text-sm">{{ item.description }}</UiTypography>
      </div>

      <div class="flex flex-row justify-between">
        <AmazonAffiliateLinkTooltip>
          <UButton
            :to="item.link"
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
          >
            Buy on Amazon
          </UButton>

          <template #text>
            <p>This is an amazon affiliate ad.</p>
            <p>I may earn a commission on purchases made through this link.</p>
          </template>
          <UButton
            icon="i-heroicons-information-circle"
            class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-wrap overflow-auto"
            variant="link"
            size="xs"
          >
            Amazon affiliate ad
          </UButton>
        </AmazonAffiliateLinkTooltip>
      </div>
    </div>
  </UCarousel>
</template>

<script setup lang="ts">
const carouselRef = ref();

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return;

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0);
    }

    carouselRef.value.next();
  }, 10000);
});
</script>
