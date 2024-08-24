import type { H3Event } from "h3";
import { serverSupabaseUser } from "#supabase/server";

export const authorize = async (event: H3Event) => {
  const loggedInUser = await serverSupabaseUser(event);

  if (!loggedInUser) {
    throw createError({
      statusCode: 401,
      message: "You must be logged in.",
    });
  }

  return loggedInUser;
};
