<template>
  <UCard class="w-full">
    <template #header>
      <h1 class="text-2xl font-bold mb-1">Set New Password</h1>
      <p class="text-sm text-gray-500">Enter your new password below.</p>
    </template>

    <UForm :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="New Password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Enter new password"
          icon="i-heroicons-lock-closed"
        />
      </UFormGroup>

      <UFormGroup label="Confirm Password">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          icon="i-heroicons-lock-closed"
        />
      </UFormGroup>

      <UButton type="submit" :loading="isSubmitting" block>
        Update Password
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center text-sm">
        <UButton @click="goBack" variant="link">Back to Login</UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "userform",
});

import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const state = reactive({
  password: "",
  confirmPassword: "",
});

const notifications = useNotification();
const isSubmitting = ref(false);

const onSubmit = async () => {
  isSubmitting.value = true;

  try {
    schema.parse(state);
  } catch (err: any) {
    notifications.error({
      title: "Invalid Input",
      message: err.errors?.[0]?.message || "Check your inputs.",
    });
    isSubmitting.value = false;
    return;
  }

  // Example: send token + new password to API
  const route = useRoute();
  const token = route.query.token;

  await useProfile().updatePassword({
    token,
    password: state.password,
  });

  notifications.success({
    title: "Password Updated",
    message: "Your password has been successfully updated.",
  });

  state.password = "";
  state.confirmPassword = "";

  isSubmitting.value = false;

  await navigateTo("/login");
};

const goBack = async () => {
  await navigateTo("/login");
};
</script>
