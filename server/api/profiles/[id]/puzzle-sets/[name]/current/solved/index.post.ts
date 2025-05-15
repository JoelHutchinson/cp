import { z } from "zod";

const routeSchema = z.object({
  id: z
    .string({
      required_error: "Profile ID is required",
      invalid_type_error: "Profile ID must be a string",
    })
    .uuid({ message: "Profile ID must be a UUID" }),
  name: z.string({
    required_error: "Puzzle set name is required",
    invalid_type_error: "Puzzle set name must be a string",
  }),
});

export default defineEventHandler(async (event) => {
  await authorize(event);

  const { id, name } = await getZodValidatedRouterParams(event, routeSchema);

  return await updateCurrentPuzzleInSetSolved(event, {
    profileId: id,
    puzzleSetName: name,
  });
});
