import { z } from "zod";

const bodySchema = z.object({
  name: z.string({
    required_error: "Puzzle set name is required",
    invalid_type_error: "Puzzle set name must be a string",
  }),
  numberOfPuzzles: z.number({
    required_error: "Number of puzzles is required",
    invalid_type_error: "Number of puzzles must be a number",
  }),
  rating: z.number({
    required_error: "Rating is required",
    invalid_type_error: "Rating must be a number",
  }),
  themes: z.array(z.string(), {
    required_error: "Themes are required",
    invalid_type_error: "Themes must be an array",
  }),
});

export default defineEventHandler(async (event) => {
  const user = await authorize(event);
  const body = await getZodValidatedBody(event, bodySchema);

  console.log("Generating puzzle set from", body);

  const puzzleSet: PuzzleSet = await generatePuzzleSet(event, {
    name: body.name,
    numberOfPuzzles: body.numberOfPuzzles,
    rating: body.rating,
    themes: body.themes,
    profileId: user.id,
  });

  console.log("Generated puzzle set", puzzleSet);

  return await createPuzzleSet(event, { puzzleSet, profileId: user.id });
});
