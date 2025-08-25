import type { H3Event } from "h3";
import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  console.log("Running anonymous user deletion cron job");
  await deleteAnonymousUsers(event);
});

export const deleteAnonymousUsers = async (event: H3Event) => {
  const supabase = serverSupabaseServiceRole<Database>(event);

  const { error } = await supabase.rpc("delete_anonymous_users");

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching puzzles. (Message: ${error.message})`,
    });
  }
};
