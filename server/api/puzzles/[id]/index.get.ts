import { z } from "zod";

const routeSchema = z.object({
  id: z
    .string({
      required_error: "Puzzle ID is required",
      invalid_type_error: "Puzzle ID must be a string",
    })
    .uuid({ message: "Puzzle ID must be a UUID" }),
});

export default defineEventHandler(async (event) => {
  await authorize(event);

  const { id } = await getZodValidatedRouterParams(event, routeSchema);

  return await fetchPuzzleById(event, { id });
});
