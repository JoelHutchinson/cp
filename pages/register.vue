<template>
  <UCard>
    <template #header>
      <h1 class="text-2xl font-bold">Register</h1>
      <div class="flex items-center">
        <p class="text-sm text-gray-500">Already have an account?</p>
        <UButton @click="navigateToSignIn" variant="link">Sign In</UButton>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" placeholder="SallyBish" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput
          v-model="state.email"
          placeholder="sallybish@example.com"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="secure_password47#P!@d"
        />
      </UFormGroup>

      <UButton type="submit" :loading="isRegistering" block> Sign Up </UButton>
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
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(8, "Must be at least 8 characters long"),
  username: z.string(),
});

const state = reactive({
  email: "",
  password: "",
  username: "",
});

const { createUserProfile, signOut } = useProfile();

const notifications = useNotification();

const isRegistering = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isRegistering.value = true;

  await signOut();

  const { error } = await createUserProfile(
    {
      id: crypto.randomUUID(),
      email: event.data.email,
      first_name: "",
      last_name: "",
      username: event.data.username,
      type: "user",
    },
    event.data.password
  );

  if (error) {
    notifications.error({
      title: "Error",
      message: error.message,
    });
  } else {
    notifications.success({
      title: "Success",
      message:
        "Account created successfully. Please check your email to verify your account before logging in.",
    });

    await navigateTo("/login");
  }

  isRegistering.value = false;
};

const navigateToSignIn = async () => {
  await navigateTo("/login");
};
</script>
