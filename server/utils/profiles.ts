import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export const fetchProfileById = async (
  event: H3Event,
  params: { id: string }
) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .match({ id: params.id })
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching profile. (Message: ${error.message})`,
    });
  }

  return data;
};

export const fetchProfiles = async (event: H3Event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching profiles. (Message: ${error.message})`,
    });
  }

  return data;
};
