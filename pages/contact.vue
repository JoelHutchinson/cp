<template>
  <div
    class="relative overflow-hidden py-6 px-4 sm:px-8 mb-12 rounded-xl shadow-lg flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-50 border border-sky-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700"
  >
    <div class="flex items-center justify-center gap-3">
      <UIcon name="i-lucide-mail" class="mb-2 text-sky-500 size-12" />
      <h1
        class="text-4xl md:text-5xl font-extrabold mb-2 text-sky-700 drop-shadow-lg dark:text-sky-300 text-center"
      >
        Contact Us
      </h1>
    </div>
  </div>

  <section class="flex flex-col items-center">
    <UCard
      class="shadow-md rounded-xl border-l-4 border-sky-400 bg-sky-50/80 p-8 max-w-2xl w-full dark:bg-gray-800/80 dark:border-sky-500"
    >
      <div class="mb-4 text-center">
        <UIcon
          name="i-lucide-message-circle"
          class="inline-block align-middle mb-1 mr-2 text-sky-400 w-7 h-7 dark:text-sky-300"
        />
        <span class="text-2xl font-bold text-sky-700 dark:text-sky-300"
          >Send us a message</span
        >
      </div>
      <div class="border-b border-sky-100 my-4 dark:border-sky-700"></div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
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
          <UInput
            v-model="state.subject"
            placeholder="Subject of your message"
          />
        </UFormGroup>

        <UFormGroup label="Message">
          <UTextarea
            v-model="state.message"
            placeholder="Write your message..."
          />
        </UFormGroup>

        <div class="pt-2">
          <UButton
            :loading="isSubmitting"
            @click="onSubmit"
            block
            size="lg"
            color="sky"
            icon="i-lucide-send"
          >
            Send Message
          </UButton>
        </div>
      </UForm>
    </UCard>
  </section>
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
