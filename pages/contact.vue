<template>
  <UiHeading class="mb-6">Contact Us</UiHeading>
  <UCard class="max-w-xl flex flex-col gap-6">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="First Name" name="firstName">
          <UInput v-model="state.firstName" placeholder="Sally" />
        </UFormGroup>

        <UFormGroup label="Last Name" name="lastName">
          <UInput v-model="state.lastName" placeholder="Bish" />
        </UFormGroup>
      </div>

      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" placeholder="SallyBish" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" placeholder="sallybish@example.com" />
      </UFormGroup>

      <UFormGroup label="Subject">
        <UInput v-model="state.subject" placeholder="Subject of your message" />
      </UFormGroup>

      <UFormGroup label="Message">
        <UTextarea
          v-model="state.message"
          placeholder="Write your message..."
        />
      </UFormGroup>
    </UForm>

    <template #footer>
      <UButton
        :loading="isSubmitting"
        @click="onSubmit"
        label="Send Message"
        block
      />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z, Schema } from "zod";

const { createContactFormEntry } = useContactFormEntry();
const notifications = useNotification();

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message cannot be empty"),
  username: z.string().min(1, "Username is required"),
  subject: z.string().optional(),
});

const state = reactive({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true;

  try {
    await createContactFormEntry(state);

    notifications.success({
      title: "Message Sent",
      message: "Thank you for contacting us!",
    });
  } catch (error: any) {
    notifications.error({
      title: "Error creating contact form entry",
      message: error.data.message,
    });
  }

  isSubmitting.value = false;
};
</script>
