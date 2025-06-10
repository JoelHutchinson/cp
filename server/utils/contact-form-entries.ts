import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export const createContactFormEntry = async (
  event: H3Event,
  params: { contactFormEntry: ContactFormEntry }
) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const { data, error } = await supabase
    .from("contact_form_entries")
    .insert(params.contactFormEntry)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Error creating contact form entry. (Message: ${error.message})`,
    });
  }

  return data;
};
