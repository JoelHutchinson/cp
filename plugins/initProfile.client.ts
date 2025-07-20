// plugins/initProfile.ts
export default defineNuxtPlugin((nuxtApp) => {
  const pinia: any = nuxtApp.$pinia;

  const myStore = useProfileStore(pinia);
  myStore.initialize();
});
