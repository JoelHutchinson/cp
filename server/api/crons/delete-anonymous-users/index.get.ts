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

  await deleteAnonymousUsers(event);
});

export const deleteAnonymousUsers = async (event: H3Event) => {
  const supabase = serverSupabaseServiceRole<Database>(event);

  const { error } = await supabase.rpc("delete_anonymous_users", {
    secret: process.env.CRON_SECRET!,
  });

  if (error) {
    console.error(error.message);
    throw createError({
      statusCode: 500,
      message: `Error deleting anonymous users. (Message: ${error.message})`,
    });
  }
};
