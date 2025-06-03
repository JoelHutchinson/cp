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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="First Name" name="firstName">
          <UInput v-model="state.firstName" />
        </UFormGroup>

        <UFormGroup label="Last Name" name="lastName">
          <UInput v-model="state.lastName" />
        </UFormGroup>
      </div>

      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput
          v-model="state.email"
          placeholder="you@example.com"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
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
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
});

const state = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  username: "",
});

const supabase = useSupabaseClient();
const notifications = useNotification();

const isRegistering = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isRegistering.value = true;

  const { error } = await supabase.auth.signUp({
    email: event.data.email,
    password: event.data.password,
    options: {
      data: {
        email: event.data.email,
        first_name: event.data.firstName,
        last_name: event.data.lastName,
        username: event.data.username,
      },
    },
  });

  isRegistering.value = false;

  if (error) {
    notifications.error({
      title: "Error",
      message: error.message,
    });
  } else {
    notifications.success({
      title: "Success",
      message:
        "Account created successfully. Please check your email to verify your account.",
    });

    await navigateTo("/login");
  }
};

const navigateToSignIn = async () => {
  await navigateTo("/login");
};
</script>
