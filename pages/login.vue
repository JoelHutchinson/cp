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
      <UButton type="submit"> Sign In </UButton>
      <UButton @click="navigateToSignUp"> Sign Up </UButton>
    </UButtonGroup>
  </UForm>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "userform",
});

const supabase = useSupabaseClient();
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

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await supabase.auth.signInWithPassword({
    email: event.data.email,
    password: event.data.password,
  });
};

const navigateToSignUp = async () => {
  await navigateTo("/register");
};
</script>
