import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { PuzzleSetPuzzle } from "~/types/types";

export const generatePuzzleSet = async (
  event: H3Event,
  params: {
    name: string;
    numberOfPuzzles: number;
    themes: string[];
    rating: number;
    profileId: string;
  }
): Promise<PuzzleSet> => {
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

  // Filter puzzles for themes provided
  const filteredData = data.filter((puzzle) =>
    params.themes.some((theme) => puzzle.themes.split(" ").includes(theme))
  );

  // Select a sample of puzzles evenly distributed across the range
  const step = Math.floor(data.length / params.numberOfPuzzles);
  const puzzles = filteredData
    .filter((_, i) => i % step === 0)
    .slice(0, params.numberOfPuzzles);

  return {
    id: crypto.randomUUID(),
    profile_id: params.profileId,
    name: params.name,
    slug: slugify(params.name),
    is_default: false,
    puzzles,
  };
};

// TODO: Implement
export const createPuzzleSet = async (
  event: H3Event,
  params: { puzzleSet: PuzzleSet; profileId: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { puzzles, ...puzzleSet } = params.puzzleSet;

  // Insert the puzzle set
  const { data, error } = await supabase
    .from("puzzle_sets")
    .insert(puzzleSet)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error creating puzzle set. (Message: ${error.message})`,
    });
  }

  // Insert the individual puzzle set puzzles
  const puzzleSetPuzzles: PuzzleSetPuzzle[] = puzzles.map((puzzle, index) => ({
    id: crypto.randomUUID(),
    index,
    is_solved: false,
    puzzle_id: puzzle.id,
    puzzle_set_id: data.id,
  }));

  const { error: puzzleSetPuzzlesError } = await supabase
    .from("puzzle_set_puzzles")
    .insert(puzzleSetPuzzles);

  if (puzzleSetPuzzlesError) {
    throw createError({
      statusCode: 500,
      message: `Error creating puzzle set puzzles. (Message: ${puzzleSetPuzzlesError.message})`,
    });
  }

  return data;
};

export const fetchPuzzleSets = async (
  event: H3Event,
  params: { profileId: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { data, error } = await supabase
    .from("puzzle_sets")
    .select("*")
    .eq("profile_id", params.profileId);

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzle sets. (Message: ${error.message})`,
    });
  }

  return data;
};

export const fetchPuzzleSetBySlug = async (
  event: H3Event,
  params: { profileId: string; slug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { data, error } = await supabase
    .from("puzzle_sets")
    .select("*")
    .match({
      profile_id: params.profileId,
      slug: params.slug,
    })
    .single();

  if (error) {
    // content not found (error due to .single()) -> 404 error
    if (error.code === "PGRST116")
      throw createError({
        statusCode: 404,
        statusMessage: `Puzzle set with slug "${params.slug}" not found for profile ID "${params.profileId}".`,
      });

    // other errors -> 500 error
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzle set. (Message: ${error.message})`,
    });
  }

  return data;
};

export const fetchDefaultPuzzleSet = async (
  event: H3Event,
  params: { profileId: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error } = await supabase
    .from("puzzle_sets")
    .select("*")
    .eq("profile_id", params.profileId)
    .eq("is_default", true)
    .single();

  if (error) {
    // content not found (error due to .single()) -> 404 error
    if (error.code === "PGRST116")
      throw createError({
        statusCode: 404,
        statusMessage: `Default puzzle set not found for profile ID "${params.profileId}".`,
      });

    // other errors -> 500 error
    throw createError({
      statusCode: 500,
      message: `Error fetching default puzzle set. (Message: ${error.message})`,
    });
  }

  return data;
};

export const fetchCurrentPuzzleInSet = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { data, error } = await supabase
    .from("puzzle_set_puzzles")
    .select("*, puzzles(*), puzzle_sets(*)")
    .match({
      "puzzle_sets.profile_id": params.profileId,
      "puzzle_sets.slug": params.puzzleSetSlug,
      is_solved: false,
    })
    .not("puzzle_sets", "is", null)
    .order("index", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    // content not found (error due to .single()) -> 404 error
    if (error.code === "PGRST116")
      throw createError({
        statusCode: 404,
        statusMessage: `Current puzzle not found for puzzle set "${params.puzzleSetSlug}" profile ID "${params.profileId}".`,
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
  params: { profileId: string; puzzleSetSlug: string }
) => {
  // get the id of the puzzle_set_puzzles record
  const supabase = await serverSupabaseClient<Database>(event);
  const { data: fetchData, error: fetchError } = await supabase
    .from("puzzle_set_puzzles")
    .select("id, puzzle_sets(*)")
    .eq("puzzle_sets.profile_id", params.profileId)
    .eq("puzzle_sets.slug", params.puzzleSetSlug)
    .eq("is_solved", false)
    .order("index", { ascending: true })
    .limit(1)
    .single();

  if (fetchError) {
    // content not found (error due to .single()) -> 404 error
    if (fetchError.code === "PGRST116")
      throw createError({
        statusCode: 404,
        statusMessage: `Current puzzle not found for puzzle set "${params.puzzleSetSlug}" profile ID "${params.profileId}".`,
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

export const deletePuzzleSet = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  // Delete the puzzle set
  const { error } = await supabase.from("puzzle_sets").delete().match({
    profile_id: params.profileId,
    slug: params.puzzleSetSlug,
  });

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error deleting puzzle set. (Message: ${error.message})`,
    });
  }

  return null;
};
