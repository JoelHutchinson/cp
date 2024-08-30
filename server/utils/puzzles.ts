import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export const fetchPuzzleById = async (
  event: H3Event,
  params: { id: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .match({ id: params.id })
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzle. (Message: ${error.message})`,
    });
  }

  return data;
};
