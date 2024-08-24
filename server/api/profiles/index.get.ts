export default defineEventHandler(async (event) => {
  await authorize(event);

  return await fetchProfiles(event);
});
