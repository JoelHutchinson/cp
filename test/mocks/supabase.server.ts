export const serverSupabaseClient = async () => ({
  from: () => ({
    insert: async () => ({ data: { id: "123" }, error: null }),
  }),
});
