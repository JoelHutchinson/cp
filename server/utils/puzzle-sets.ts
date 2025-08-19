import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import { PuzzleSetPuzzle } from "~/types/types";

export const generatePuzzleSet = async (
  event: H3Event,
  params: {
    name: string;
    numberOfPuzzles: number;
    themes: string[];
    totalCycles: number;
    rating: number;
    profileId: string;
  }
): Promise<PuzzleSetWithPuzzles> => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error } = await supabase.rpc("get_closest_puzzles", {
    target_rating: params.rating,
    theme_list: params.themes,
  });

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzles. (Message: ${error.message})`,
    });
  }

  if (data.length === 0) {
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzles. (Message: No puzzles of this theme were found)`,
    });
  }

  let puzzles = [];

  // Select a sample of puzzles evenly distributed across the range
  const step = Math.floor(data.length / params.numberOfPuzzles);
  const sampledPuzzles = data
    .filter((_, i) => i % step === 0)
    .slice(0, params.numberOfPuzzles);

  if (sampledPuzzles.length < params.numberOfPuzzles) {
    puzzles = data.slice(0, params.numberOfPuzzles);
  } else {
    puzzles = sampledPuzzles;
  }

  return {
    id: crypto.randomUUID(),
    profile_id: params.profileId,
    name: params.name,
    slug: slugify(params.name),
    is_default: false,
    current_cycle: 1,
    total_cycles: params.totalCycles,
    puzzles,
  };
};

export const createPuzzleSet = async (
  event: H3Event,
  params: { puzzleSet: PuzzleSetWithPuzzles; profileId: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { puzzles, ...puzzleSet } = params.puzzleSet;

  const { data: existingPuzzleSets, error: existingError } = await supabase
    .from("puzzle_sets")
    .select("*")
    .eq("profile_id", params.profileId);

  if (existingError) {
    throw createError({
      statusCode: 500,
      message: `Error checking existing puzzle sets. (Message: ${existingError.message})`,
    });
  }

  // Check if the puzzle set is called 'default'
  if (puzzleSet.slug === "default") {
    throw createError({
      statusCode: 400,
      message: `Puzzle set slug "default" is reserved and cannot be used.`,
    });
  }

  // Check if this is the first puzzle set for the profile, and that the slug is unique
  let isDefault = false;

  if (existingPuzzleSets.length === 0) {
    isDefault = true;
  } else {
    // Check if the slug already exists for this profile
    const existingSlug = existingPuzzleSets.find(
      (set) =>
        set.slug === puzzleSet.slug && set.profile_id === params.profileId
    );
    if (existingSlug) {
      throw createError({
        statusCode: 400,
        message: `Puzzle set with slug "${puzzleSet.slug}" already exists for this profile.`,
      });
    }
  }

  // Insert the puzzle set
  const { data, error } = await supabase
    .from("puzzle_sets")
    .insert({ ...puzzleSet, is_default: isDefault })
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
    progress: { incorrect_solves: 0, correct_solves: 0 },
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

export const fetchPuzzleSetProgressBySlug = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  let { data, error } = await supabase.rpc("get_puzzle_set_progress", {
    _profile_id: params.profileId,
    _puzzle_set_slug: params.puzzleSetSlug,
  });

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching current puzzle in set. (Message: ${error.message})`,
    });
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: `No progress found for puzzle set with slug "${params.puzzleSetSlug}" for profile ID "${params.profileId}".`,
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

  let { data, error } = await supabase.rpc("get_current_puzzle_in_set", {
    _profile_id: params.profileId,
    _puzzle_set_slug: params.puzzleSetSlug,
  });

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching current puzzle in set. (Message: ${error.message})`,
    });
  }

  if (!data || data.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: `No current puzzle found in set with slug "${params.puzzleSetSlug}" for profile ID "${params.profileId}".`,
    });
  }

  return {
    puzzle: { ...data![0], progress: undefined } as Puzzle,
    progress: data![0].progress as PuzzleSetPuzzleProgress,
  };
};

export const fetchNextPuzzleInSet = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  let { data, error } = await supabase.rpc("get_next_puzzle_in_set", {
    _profile_id: params.profileId,
    _puzzle_set_slug: params.puzzleSetSlug,
  });

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching next puzzle in set. (Message: ${error.message})`,
    });
  }

  if (!data || data.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: `No next puzzle found in set with slug "${params.puzzleSetSlug}" for profile ID "${params.profileId}".`,
    });
  }

  return {
    puzzle: { ...data![0], progress: undefined } as Puzzle,
    progress: data![0].progress as PuzzleSetPuzzleProgress,
  };
};

export const updateDefaultPuzzleSet = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  // First, unset the current default puzzle set
  const { error: unsetError } = await supabase
    .from("puzzle_sets")
    .update({ is_default: false })
    .eq("profile_id", params.profileId)
    .eq("is_default", true);

  if (unsetError) {
    throw createError({
      statusCode: 500,
      message: `Error unsetting current default puzzle set. (Message: ${unsetError.message})`,
    });
  }

  // Then, set the new default puzzle set
  const { data, error } = await supabase
    .from("puzzle_sets")
    .update({ is_default: true })
    .eq("profile_id", params.profileId)
    .eq("slug", params.puzzleSetSlug)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error setting new default puzzle set. (Message: ${error.message})`,
    });
  }

  return data;
};

export const updateCurrentPuzzleInSetProgress = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string; solved: boolean }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  let { data, error } = await supabase.rpc(
    "update_current_puzzle_in_set_progress",
    {
      _profile_id: params.profileId,
      _puzzle_set_slug: params.puzzleSetSlug,
      _solved: params.solved,
    }
  );

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error updating current puzzle in set progress. (Message: ${error.message})`,
    });
  }

  return {
    puzzle: { ...data![0], progress: undefined } as Puzzle,
    progress: data![0].progress as PuzzleSetPuzzleProgress,
  };
};

export const incrementPuzzleSetCycleIfReady = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error } = await supabase.rpc(
    "increment_puzzle_set_cycle_if_ready",
    {
      _profile_id: params.profileId,
      _puzzle_set_slug: params.puzzleSetSlug,
    }
  );

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error incrementing puzzle set cycle. (Message: ${error.message})`,
    });
  }

  return data;
};

export const deletePuzzleSet = async (
  event: H3Event,
  params: { profileId: string; puzzleSetSlug: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

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
};
