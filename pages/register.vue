<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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

    <UFormGroup label="Username" name="username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup label="First Name" name="firstName">
      <UInput v-model="state.firstName" />
    </UFormGroup>

    <UFormGroup label="Last Name" name="lastName">
      <UInput v-model="state.lastName" />
    </UFormGroup>

    <UButtonGroup>
      <UButton type="submit" :loading="isRegistering"> Sign Up </UButton>
      <UButton @click="navigateToSignIn"> Sign In </UButton>
    </UButtonGroup>
  </UForm>
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

  const { data, error } = await supabase.auth.signUp({
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
    console.error(error);
    notifications.error({
      title: "Error",
      message: error.message,
    });
  } else {
    console.log("User created successfully", data);
    notifications.success({
      title: "Success",
      message:
        "Account created successfully. Please check your email to verify your account.",
    });
  }
};

const navigateToSignIn = async () => {
  await navigateTo("/login");
};
</script>
