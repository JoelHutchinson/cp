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

const bodySchema = z.object({
  solved: z.boolean({
    required_error: "Solved status is required",
    invalid_type_error: "Solved status must be a boolean",
  }),
});

export default defineEventHandler(async (event) => {
  await authorize(event);

  const { id, slug } = await getZodValidatedRouterParams(event, routeSchema);

  const { solved } = await getZodValidatedBody(event, bodySchema);

  await updateCurrentPuzzleInSetProgress(event, {
    profileId: id,
    puzzleSetSlug: slug,
    solved,
  });

  // If all of the puzzles in the set are solved, increment the set's cycle OR do this in rpc?
  await incrementPuzzleSetCycleIfReady(event, {
    profileId: id,
    puzzleSetSlug: slug,
  });
});
