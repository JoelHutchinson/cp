<template>
  <div
    class="flex flex-col md:flex-row gap-24 py-8 px-4 sm:px-8 max-w-5xl mx-auto"
  >
    <!-- Left: Messaging -->
    <div class="flex-1 flex flex-col justify-center mb-8 md:mb-0">
      <h1 class="text-4xl font-extrabold mb-4 text-primary-600">Contact Us</h1>
      <p class="mb-4 text-lg text-gray-500 dark:text-gray-300">
        ChessPecker is a new app and we're eager to hear from you. Whether you
        have feedback, feature requests / ideas, questions, or want to report an
        issue or bug, your input helps us improve the experience.
      </p>
      <div class="mb-4">
        <span class="font-semibold text-primary-600"
          >We'd love to hear about:</span
        >
        <ul
          class="list-disc list-inside space-y-1 mt-2 text-gray-700 dark:text-gray-300"
        >
          <li>Feature requests or ideas for improvement</li>
          <li>Any bugs or issues you encounter</li>
          <li>General feedback about your experience</li>
        </ul>
      </div>
      <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
        We read every message and aim to respond promptly. Thank you for helping
        us make ChessPecker better!
      </div>
    </div>

    <!-- Right: Form -->
    <div class="flex-1 flex flex-col items-center">
      <UCard
        class="shadow-md rounded-xl bg-primary-50/80 p-8 w-full max-w-xl dark:bg-gray-800/80 dark:border-primary-500"
      >
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
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
              color="primary"
              icon="i-lucide-send"
            >
              Send Message
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z, Schema } from "zod";

const { createContactFormEntry } = useContactFormEntry();
const notifications = useNotification();

const schema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  subject: z.string().optional(),
});

const state = reactive({
  subject: "",
  message: "",
});

const { profile } = useProfile();

const isSubmitting = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true;

  try {
    await createContactFormEntry({
      firstName: "BLANK",
      lastName: "BLANK",
      username: "BLANK",
      email: profile.email,
      subject: state.subject,
      message: state.message,
    });

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
