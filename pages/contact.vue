<template>
  <div
    class="relative overflow-hidden py-12 px-4 sm:px-8 mb-12 rounded-xl shadow-lg flex flex-col items-center text-center bg-gradient-to-br from-sky-100 via-white to-sky-50 border border-sky-200"
  >
    <UIcon name="i-lucide-mail" class="mx-auto mb-4 text-sky-500 w-20 h-20" />
    <h1
      class="text-4xl md:text-5xl font-extrabold mb-2 text-sky-700 drop-shadow-lg"
    >
      Contact Us
    </h1>
    <p class="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-4">
      We'd love to hear from you! Fill out the form below and our team will get
      back to you as soon as possible.
    </p>
  </div>

  <section class="flex flex-col items-center">
    <UCard
      class="shadow-md rounded-xl border-l-4 border-sky-400 bg-sky-50/80 p-8 max-w-2xl w-full"
    >
      <div class="mb-4 text-center">
        <UIcon
          name="i-lucide-message-circle"
          class="inline-block align-middle mb-1 mr-2 text-sky-400 w-7 h-7"
        />
        <span class="text-2xl font-bold text-sky-700">Send us a message</span>
      </div>
      <div class="border-b border-sky-100 my-4"></div>
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
