export const usePuzzleSet = (slug: string) => {
  const { profile } = useFetchProfile();

  const {
    data,
    refresh: refreshPuzzle,
    status: puzzleStatus,
  } = useLazyAsyncData(() => {
    return $fetch<{ puzzle: Puzzle; progress: PuzzleSetPuzzleProgress }>(
      `/api/profiles/${profile.value!.id}/puzzle-sets/${slug}/current-puzzle`,
      {
        headers: useRequestHeaders(["cookie"]), // needed to pass supabase auth session
      }
    );
  });

  const puzzle = computed(() => data.value?.puzzle);
  const puzzleProgress = computed(() => data.value?.progress);
  const puzzleSetProgress = ref();
  const puzzleCorrectness = ref(false);

  const fetchPuzzleSetProgress = async () => {
    puzzleSetProgress.value = await $fetch(
      `/api/profiles/${profile.value!.id}/puzzle-sets/${slug}/progress`,
      {
        headers: useRequestHeaders(["cookie"]), // needed to pass supabase auth session
      }
    );
  };

  const updateProgress = (solved: boolean) => {
    if (
      puzzleSetProgress.value.solved_in_current_cycle + 1 >=
      puzzleSetProgress.value.total_puzzles
    ) {
      // reset the puzzleSetProgress for the current cycle
      puzzleSetProgress.value.solved_in_current_cycle = 0;
      puzzleSetProgress.value.solved_correctly_in_current_cycle = 0;
      puzzleSetProgress.value.solved_incorrectly_in_current_cycle = 0;

      // increment the current cycle
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
    // increment the local progress values
    updateProgress(puzzleCorrectness.value);

    // post a request to the server to update the progress
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

    puzzleCorrectness.value = true;

    // refresh the puzzle data
    await refreshPuzzle();
  };

  const makePuzzleMove = (correct: boolean) => {
    if (!correct) {
      puzzleCorrectness.value = false;
    }
  };

  return {
    puzzle,
    puzzleStatus,
    refreshPuzzle,
    puzzleProgress,
    fetchPuzzleSetProgress,
    makePuzzleMove,
    solvePuzzle,
    puzzleSetProgress,
  };
};
