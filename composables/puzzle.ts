const key = "puzzle";

export const usePuzzle = (id: string) => {
  const { data: puzzle } = useNuxtData<Puzzle>(key);
  const refresh = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };
  const fetch = async () => {
    await useFetch(`/api/puzzles/${id}`, { key });
  };

  return { puzzle, fetch, refresh };
};
