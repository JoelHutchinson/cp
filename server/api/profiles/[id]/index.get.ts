import { z } from "zod";

const routeSchema = z.object({
  id: z
    .string({
      required_error: "Profile ID is required",
      invalid_type_error: "Profile ID must be a string",
    })
    .uuid({ message: "Profile ID must be a UUID" }),
});

export default defineEventHandler(async (event) => {
  await authorize(event);

  const { id } = await getZodValidatedRouterParams(event, routeSchema);

  return await fetchProfileById(event, { id });
});
