const key = "fetch-puzzle";

export const useFetchPuzzle = (id: string) =>
  useLazyAsyncData(key, () => $fetch(`/api/puzzles/${id}`));
