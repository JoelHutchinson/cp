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

    <UFormGroup label="Username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup label="First Name">
      <UInput v-model="state.firstName" />
    </UFormGroup>

    <UFormGroup label="Last Name">
      <UInput v-model="state.lastName" />
    </UFormGroup>

    <UButtonGroup>
      <UButton type="submit"> Sign Up </UButton>
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
  email: z.string().email(),
  password: z.string().min(8),
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

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  console.log("Registering: ", event.data);

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

  console.log("Registered: ", data);

  if (error) console.log(error);
};

const navigateToSignIn = async () => {
  await navigateTo("/login");
};
</script>
