const key = "puzzle";

export const usePuzzle = (id: string) =>
  useLazyAsyncData(key, () => $fetch(`/api/puzzles/${id}`));
