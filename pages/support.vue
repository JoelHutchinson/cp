<template>
  <div class="max-w-xl mx-auto py-10 px-6 text-center space-y-6">
    <UCard :ui="{ padding: 'p-6' }">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">Buy Me a Coffee ☕</h1>
        <p class="text-gray-600">
          If you enjoy this site, consider buying me a coffee! In order to cover
          server costs and development time, your support is greatly
          appreciated.
        </p>
      </div>

      <template #footer>
        <div class="flex flex-row gap-4">
          <UButton
            size="lg"
            color="primary"
            :to="MONTHLY_STRIPE_PAYMENT_LINK"
            class="w-1/2 text-center"
            icon="i-heroicons-currency-dollar-20-solid"
            target="_blank"
          >
            Monthly ($5/month)
          </UButton>

          <UButton
            size="lg"
            color="primary"
            :to="ONE_OFF_STRIPE_PAYMENT_LINK"
            class="w-1/2 text-center"
            icon="i-heroicons-currency-dollar-20-solid"
            target="_blank"
          >
            One-off Tip
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const ONE_OFF_STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/test_3cIcN6g3B5vk0Cm6k5djO01";

const MONTHLY_STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/test_8x2cN69Fd4rg98SdMxdjO00";
</script>
