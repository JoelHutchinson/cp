<template>
  <UCard class="w-full">
    <template #header>
      <h1 class="text-2xl font-bold mb-1">Reset Password</h1>
      <p class="text-sm text-gray-500">
        Enter your email to receive reset instructions.
      </p>
    </template>

    <UForm :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email">
        <UInput
          v-model="state.email"
          autocomplete="email"
          placeholder="Enter your email"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>

      <UButton type="submit" :loading="isSubmitting" block>
        Send Reset Link
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center text-sm">
        <UButton @click="goBack" variant="link"> Back to Login </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "userform",
});

import { z } from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const state = reactive({
  email: "",
});

const { forgotPassword } = useProfile();

const notifications = useNotification();
const isSubmitting = ref(false);

const onSubmit = async () => {
  isSubmitting.value = true;

  try {
    schema.parse(state);
  } catch {
    notifications.error({
      title: "Invalid email",
      message: "Please enter a valid email address",
    });
    isSubmitting.value = false;
    return;
  }

  await forgotPassword(state.email);

  notifications.success({
    title: "Email Sent",
    message: "If an account exists for this email, a reset link has been sent.",
  });

  state.email = "";
  isSubmitting.value = false;
};

const goBack = async () => {
  await navigateTo("/login");
};
</script>
