<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email">
      <UInput
        v-model="state.email"
        placeholder="you@example.com"
        icon="i-heroicons-envelope"
      />
    </UFormGroup>

    <UFormGroup label="Password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButtonGroup>
      <UButton type="submit" :loading="isLoggingIn"> Sign In </UButton>
      <UButton @click="navigateToSignUp"> Sign Up </UButton>
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
  email: z.string().email(),
  password: z.string(),
});

const state = reactive({
  email: "",
  password: "",
});

const supabase = useSupabaseClient();
const notifications = useNotification();

const isLoggingIn = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoggingIn.value = true;

  const { error } = await supabase.auth.signInWithPassword({
    email: event.data.email,
    password: event.data.password,
  });

  isLoggingIn.value = false;

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

    await navigateTo("/");
  }
};

const navigateToSignUp = async () => {
  await navigateTo("/register");
};
</script>
