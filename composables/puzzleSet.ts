import { ref, computed, onMounted } from "vue";

export const usePuzzleSet = (slug: string) => {
  const { profile } = useFetchProfile();

  const currentPuzzle = ref<Puzzle | null>(null);
  const currentPuzzleProgress = ref<PuzzleSetPuzzleProgress | null>(null);

  const nextPuzzle = ref<Puzzle | null>(null);
  const nextPuzzleProgress = ref<PuzzleSetPuzzleProgress | null>(null);

  const puzzleSetProgress = ref<any>(null);
  const puzzleCorrectness = ref(true); // default true; set false on wrong move

  const isLoading = ref(true);

  const puzzleStatus = computed(() => {
    return isLoading.value ? "pending" : "success";
  });

  const fetchCurrentPuzzle = async () => {
    const data = await $fetch<{
      puzzle: Puzzle;
      progress: PuzzleSetPuzzleProgress;
    }>(
      `/api/profiles/${profile.value!.id}/puzzle-sets/${slug}/current-puzzle`,
      {
        headers: useRequestHeaders(["cookie"]),
      }
    );

    currentPuzzle.value = data.puzzle;
    currentPuzzleProgress.value = data.progress;
  };

  const fetchNextPuzzle = async () => {
    const data = await $fetch<{
      puzzle: Puzzle;
      progress: PuzzleSetPuzzleProgress;
    }>(`/api/profiles/${profile.value!.id}/puzzle-sets/${slug}/next-puzzle`, {
      headers: useRequestHeaders(["cookie"]),
    });

    nextPuzzle.value = data.puzzle;
    nextPuzzleProgress.value = data.progress;
  };

  const fetchPuzzleSetProgress = async () => {
    puzzleSetProgress.value = await $fetch(
      `/api/profiles/${profile.value!.id}/puzzle-sets/${slug}/progress`,
      {
        headers: useRequestHeaders(["cookie"]),
      }
    );
  };

  const updateLocalProgress = (solved: boolean) => {
    if (
      puzzleSetProgress.value.solved_in_current_cycle + 1 >=
      puzzleSetProgress.value.total_puzzles
    ) {
      puzzleSetProgress.value.solved_in_current_cycle = 0;
      puzzleSetProgress.value.solved_correctly_in_current_cycle = 0;
      puzzleSetProgress.value.solved_incorrectly_in_current_cycle = 0;
      puzzleSetProgress.value.current_cycle++;
      return;
    }

    puzzleSetProgress.value.solved_in_current_cycle++;

    if (solved) {
      puzzleSetProgress.value.solved_correctly_in_current_cycle++;
      puzzleSetProgress.value.total_correct_solves++;
    } else {
      puzzleSetProgress.value.solved_incorrectly_in_current_cycle++;
      puzzleSetProgress.value.total_incorrect_solves++;
    }
  };

  const solvePuzzle = async () => {
    updateLocalProgress(puzzleCorrectness.value);

    await $fetch(
      `/api/profiles/${
        profile.value!.id
      }/puzzle-sets/${slug}/current-puzzle/solves`,
      {
        method: "POST",
        body: {
          solved: puzzleCorrectness.value,
        },
      }
    );

    // If we've reached the end of the set, re-fetch all progress and puzzles
    if (puzzleSetProgress.value.solved_in_current_cycle === 0) {
      await Promise.all([
        fetchCurrentPuzzle(),
        fetchNextPuzzle(),
        fetchPuzzleSetProgress(),
      ]);
    } else {
      // Promote next puzzle to current
      currentPuzzle.value = nextPuzzle.value;
      currentPuzzleProgress.value = nextPuzzleProgress.value;
    }

    // If we are on the second to last puzzle, don't pre-fetch next puzzle
    if (
      puzzleSetProgress.value.solved_in_current_cycle !==
      puzzleSetProgress.value.total_puzzles - 1
    ) {
      // Pre-fetch new next puzzle
      await fetchNextPuzzle();
    }

    // Reset correctness for next puzzle
    puzzleCorrectness.value = true;
  };

  const makePuzzleMove = (correct: boolean) => {
    if (!correct) {
      puzzleCorrectness.value = false;
    }
  };

  const loadInitialData = async () => {
    isLoading.value = true;
    await Promise.all([
      fetchCurrentPuzzle(),
      fetchNextPuzzle(),
      fetchPuzzleSetProgress(),
    ]);
    isLoading.value = false;
  };

  onMounted(loadInitialData);

  return {
    currentPuzzle,
    currentPuzzleProgress,
    nextPuzzle,
    nextPuzzleProgress,
    puzzleSetProgress,
    puzzleCorrectness,
    puzzleStatus,
    makePuzzleMove,
    solvePuzzle,
    refreshProgress: fetchPuzzleSetProgress,
  };
};
