import { z } from "zod";

const routeSchema = z.object({
  id: z
    .string({
      required_error: "Profile ID is required",
      invalid_type_error: "Profile ID must be a string",
    })
    .uuid({ message: "Profile ID must be a UUID" }),
});

const bodySchema = z.object({
  slug: z
    .string({
      required_error: "Puzzle set slug is required",
      invalid_type_error: "Puzzle set slug must be a string",
    })
    .min(1, {
      message: "Puzzle set slug must not be empty",
    }),
});

export default defineEventHandler(async (event) => {
  await authorize(event);

  const { id } = await getZodValidatedRouterParams(event, routeSchema);

  const { slug } = await getZodValidatedBody(event, bodySchema);

  return await updateDefaultPuzzleSet(event, {
    profileId: id,
    puzzleSetSlug: slug,
  });
});
