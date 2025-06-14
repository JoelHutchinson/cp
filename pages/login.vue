<template>
  <UCard class="w-full">
    <template #header>
      <h1 class="text-2xl font-bold">Sign In</h1>
      <div class="flex items-center">
        <p class="text-sm text-gray-500">Don't have an account yet?</p>
        <UButton @click="navigateToSignUp" variant="link">Sign Up</UButton>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email">
        <UInput
          v-model="state.email"
          placeholder="Enter your email"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>

      <UFormGroup label="Password">
        <UInput
          v-model="state.password"
          icon="i-heroicons-lock-closed"
          placeholder="Enter your password"
          type="password"
        />
      </UFormGroup>

      <UButton type="submit" :loading="isLoggingIn" block> Log in </UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "userform",
});

import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";

type Schema = z.output<typeof schema>;

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const state = reactive({
  email: "",
  password: "",
});

const { signIn } = useProfile();
const notifications = useNotification();

const isLoggingIn = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoggingIn.value = true;

  const { error } = await signIn(event.data.email, event.data.password);

  if (error) {
    notifications.error({
      title: "Login failed",
      message: error.message,
    });
  } else {
    notifications.success({
      title: "Logged in successfully",
      message: "Welcome back!",
    });

    await navigateTo("/puzzle-set");
  }

  isLoggingIn.value = false;
};

const navigateToSignUp = async () => {
  await navigateTo("/register");
};
</script>
