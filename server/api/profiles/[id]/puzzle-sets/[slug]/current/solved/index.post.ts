import { z } from "zod";

const routeSchema = z.object({
  id: z
    .string({
      required_error: "Profile ID is required",
      invalid_type_error: "Profile ID must be a string",
    })
    .uuid({ message: "Profile ID must be a UUID" }),
  slug: z.string({
    required_error: "Puzzle set slug is required",
    invalid_type_error: "Puzzle set slug must be a string",
  }),
});

export default defineEventHandler(async (event) => {
  await authorize(event);

  const { id, slug } = await getZodValidatedRouterParams(event, routeSchema);

  return await updateCurrentPuzzleInSetSolved(event, {
    profileId: id,
    puzzleSetSlug: slug,
  });
});
