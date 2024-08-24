import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error } = await supabase.auth.admin.deleteUser(
    "73f72471-46d9-423a-b632-b3f8514aa27d"
  );

  return { data, error };
});
