<template>
  <UCard class="w-full">
    <template #header>
      <h1 class="text-2xl font-bold">Sign In</h1>
      <div class="flex items-center">
        <p class="text-sm text-gray-500">Don't have an account yet?</p>
        <UButton @click="navigateToSignUp" variant="link">Sign Up</UButton>
      </div>
    </template>

    <UForm :state="state" class="space-y-4" @submit="onSubmit">
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

      <UButton type="submit" :loading="isUserLoggingIn" block> Log in </UButton>

      <UDivider><span class="text-sm text-gray-500">Or</span></UDivider>

      <UButton
        @click="tryAsGuest"
        :loading="isGuestLoggingIn"
        variant="outline"
        block
      >
        Try as a Guest
      </UButton>
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
  email: z
    .string()
    .min(1, "Email field cannot be empty")
    .email("Email field is not a valid email address"),
  password: z.string().min(1, "Password field cannot be empty"),
});

const state = reactive({
  email: "",
  password: "",
});

const { signIn, createGuestProfile } = useProfile();
const notifications = useNotification();

const isUserLoggingIn = ref(false);
const isGuestLoggingIn = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isUserLoggingIn.value = true;

  try {
    schema.parse(state);
  } catch (error: any) {
    notifications.error({
      title: "Login failed",
      message: JSON.parse(error)[0].message,
    });

    isUserLoggingIn.value = false;

    return;
  }

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

    await navigateTo("/about");
  }

  isUserLoggingIn.value = false;
};

const navigateToSignUp = async () => {
  await navigateTo("/register");
};

const tryAsGuest = async () => {
  isGuestLoggingIn.value = true;

  notifications.success({
    title: "Logged in as Guest",
    message: "Enjoy your time!",
  });

  await navigateTo("/about");

  isGuestLoggingIn.value = false;
};
</script>
