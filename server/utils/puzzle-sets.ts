import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { PuzzleSetPuzzle } from "~/types/types";

// TODO: Implement
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

// TODO: Implement
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

export const fetchPuzzleSetByName = async (
  event: H3Event,
  params: { profileId: string; name: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { data, error } = await supabase
    .from("puzzle_sets")
    .select("*")
    .match({
      profile_id: params.profileId,
      name: params.name,
    })
    .single();

  if (error) {
    // content not found (error due to .single()) -> 404 error
    if (error.code === "PGRST116")
      throw createError({
        statusCode: 404,
        statusMessage: `Puzzle set with name "${params.name}" not found for profile ID "${params.profileId}".`,
      });

    // other errors -> 500 error
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzle set. (Message: ${error.message})`,
    });
  }

  return data;
};

export const fetchCurrentPuzzleInSet = async (
  event: H3Event,
  params: { profileId: string; puzzleSetName: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { data, error } = await supabase
    .from("puzzle_set_puzzles")
    .select("puzzles(*), puzzle_sets(*)")
    .eq("puzzle_sets.profile_id", params.profileId)
    .eq("puzzle_sets.name", params.puzzleSetName)
    .eq("is_solved", false)
    .order("index", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    // content not found (error due to .single()) -> 404 error
    if (error.code === "PGRST116")
      throw createError({
        statusCode: 404,
        statusMessage: `Current puzzle not found for puzzle set "${params.puzzleSetName}" profile ID "${params.profileId}".`,
      });

    // other errors -> 500 error
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzle. (Message: ${error.message})`,
    });
  }

  return data.puzzles;
};

export const updateCurrentPuzzleInSetSolved = async (
  event: H3Event,
  params: { profileId: string; puzzleSetName: string }
) => {
  // get the id of the puzzle_set_puzzles record
  const supabase = await serverSupabaseClient<Database>(event);
  const { data: fetchData, error: fetchError } = await supabase
    .from("puzzle_set_puzzles")
    .select("id, puzzle_sets(*)")
    .eq("puzzle_sets.profile_id", params.profileId)
    .eq("puzzle_sets.name", params.puzzleSetName)
    .eq("is_solved", false)
    .order("index", { ascending: true })
    .limit(1)
    .single();

  console.log(fetchData);

  if (fetchError) {
    // content not found (error due to .single()) -> 404 error
    if (fetchError.code === "PGRST116")
      throw createError({
        statusCode: 404,
        statusMessage: `Current puzzle not found for puzzle set "${params.puzzleSetName}" profile ID "${params.profileId}".`,
      });

    // other errors -> 500 error
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzle. (Message: ${fetchError.message})`,
    });
  }

  // set the is_solved field to true
  const { data: updateData, error: updateError } = await supabase
    .from("puzzle_set_puzzles")
    .update({ is_solved: true })
    .eq("id", fetchData.id)
    .select();

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: `Error updating puzzle. (Message: ${updateError.message})`,
    });
  }

  return updateData;
};
