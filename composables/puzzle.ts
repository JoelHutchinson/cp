const key = "puzzle";

export const usePuzzle = (id: string) => {
  const { data: puzzle } = useNuxtData<Puzzle>(key);

  const refreshPuzzle = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };

  const fetchPuzzle = async () => {
    await useFetch(`/api/puzzles/${id}`, { key });
  };

  return { puzzle, fetchPuzzle, refreshPuzzle };
};
