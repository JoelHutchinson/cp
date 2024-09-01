import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { PuzzleSetPuzzle } from "~/types/types";

export const generatePuzzleSet = async (
  event: H3Event,
  params: {
    name: string;
    numberOfPuzzles: number;
    rating: number;
  }
): PuzzleSet => {
  const supabase = await serverSupabaseClient<Database>(event);

  // Order puzzles by rating, and pick within a range of +-250 elo
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .order("rating", { ascending: true })
    .lte("rating", params.rating + 250)
    .gte("rating", params.rating - 250);

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzles. (Message: ${error.message})`,
    });
  }

  // Select a sample of puzzles evenly distributed across the range
  const step = Math.floor(data.length / params.numberOfPuzzles);
  const puzzles = data
    .filter((_, i) => i % step === 0)
    .slice(0, params.numberOfPuzzles);

  return { name: params.name, puzzles };
};

export const createPuzzleSet = async (
  event: H3Event,
  params: { puzzleSet: PuzzleSet }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  // Insert the puzzle set
  const { data, error } = await supabase
    .from("puzzle_sets")
    .insert(params.puzzleSet)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error creating puzzle set. (Message: ${error.message})`,
    });
  }

  // Insert the individual puzzle set puzzles
  const puzzleSetPuzzles: PuzzleSetPuzzle[] = params.puzzleSet.puzzles.map(
    (puzzle) => ({
      puzzle_set_id: data.id,
      puzzle_id: puzzle.id,
    })
  );

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error creating puzzle set. (Message: ${error.message})`,
    });
  }

  return data;
};
