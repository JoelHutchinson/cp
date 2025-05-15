import { z } from "zod";

const bodySchema = z.object({
  name: z.string({
    required_error: "Puzzle set name is required",
    invalid_type_error: "Puzzle set name must be a string",
  }),
  number_of_puzzles: z.number({
    required_error: "Number of puzzles is required",
    invalid_type_error: "Number of puzzles must be a number",
  }),
  rating: z.number({
    required_error: "Rating is required",
    invalid_type_error: "Rating must be a number",
  }),
  themes: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  await authorize(event);

  const body = getZodValidatedBody(event, bodySchema);

  const puzzleSet: PuzzleSet = generatePuzzleSet(
    body.name,
    body.number_of_puzzles,
    body.rating,
    body.themes
  );

  return await createPuzzleSet(event, {});
});
