import { z } from "zod";

const bodySchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name must be a string",
    })
    .min(1, {
      message: "First name must not be empty",
    }),
  lastName: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be a string",
    })
    .min(1, {
      message: "Last name must not be empty",
    }),
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(1, {
      message: "Username must not be empty",
    }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({
      message: "Email must be a valid email address",
    }),
  subject: z
    .string({
      required_error: "Subject is required",
      invalid_type_error: "Subject must be a string",
    })
    .min(1, {
      message: "Subject must not be empty",
    }),

  message: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .min(1, {
      message: "Message must not be empty",
    }),
});

export default defineEventHandler(async (event) => {
  // TODO: Get the user, but don't require it
  const user = await authorize(event);

  const body = await getZodValidatedBody(event, bodySchema);

  return await createContactFormEntry(event, {
    contactFormEntry: {
      id: crypto.randomUUID(),
      first_name: body.firstName,
      last_name: body.lastName,
      username: body.username,
      email: body.email,
      subject: body.subject,
      message: body.message,
      profile_id: user?.id ?? null,
    },
  });
});
