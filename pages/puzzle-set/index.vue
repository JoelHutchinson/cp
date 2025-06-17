<template>
  <div class="flex flex-row justify-between items-center mb-6 md:p-0">
    <UiHeading>Your Puzzle Sets</UiHeading>

    <div class="flex flex-col sm:flex-row gap-2">
      <UButton
        @click="isCreateModalOpen = !isCreateModalOpen"
        icon="i-heroicons-plus"
        trailing
        >Create</UButton
      >
      <UButton
        @click="refreshPuzzleSets"
        :loading="status === 'pending'"
        icon="i-heroicons-arrow-path"
        trailing
        >Refresh</UButton
      >
    </div>
  </div>

  <UTable
    :columns="tableColumns"
    :rows="data ?? []"
    :loading="status === 'pending'"
  >
    <template #name-data="{ row }">
      <span class="font-bold text-gray-900 dark:text-white">{{
        row.name
      }}</span>
    </template>

    <template #is_default-data="{ row }">
      <div class="flex items-center justify-center">
        <UBadge v-if="row.is_default" color="white" class="hidden sm:inline"
          >Default</UBadge
        >
        <UIcon
          v-if="row.is_default"
          name="i-heroicons-star-20-solid"
          class="sm:hidden text-primary-400"
        />
      </div>
    </template>

    <template #cycles-data="{ row }">
      <div class="flex flex-row items-center gap-2">
        <UIcon name="i-heroicons-arrows-arrow-path" />

        <UiTypography class="text-sm text-gray-500">
          {{ row.current_cycle - 1 }} Cycles
        </UiTypography>
      </div>
    </template>

    <template #created_at-data="{ row }">
      <UiFormattedDate :date="row.created_at" class="hidden sm:block" />
    </template>

    <template #actions-data="{ row }">
      <UiActionsDropdown
        :actions="[
          [
            {
              label: 'Make Default',
              icon: 'i-heroicons-star',
              click: () => {
                puzzleSetToMakeDefault = row;
                isMakeDefaultModalOpen = true;
              },
              disabled: row.is_default,
            },
            {
              label: 'Delete',
              icon: 'i-heroicons-trash',
              click: () => {
                puzzleSetToDelete = row;
                isDeleteModalOpen = true;
              },
              disabled: row.is_default,
            },
          ],
        ]"
      />
    </template>

    <template #empty-state>
      <div
        class="flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14"
      >
        <UIcon
          name="i-heroicons-puzzle-piece-20-solid"
          class="w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4"
        />
        <span class="text-sm text-center text-gray-900 dark:text-white"
          >No Puzzle Sets.</span
        >
      </div>
    </template>
  </UTable>

  <UiModal
    v-model="isCreateModalOpen"
    @action="createPuzzleSet"
    :loading="isCreateLoading"
    title="Create a puzzle set"
    buttonText="Create"
    buttonColor="primary"
  >
    <div class="flex flex-col gap-4">
      <UFormGroup label="Name">
        <UInput v-model="state.name" placeholder="Puzzle set name" />
      </UFormGroup>

      <UFormGroup label="Number of Puzzles">
        <UiRange
          v-model="state.numberOfPuzzles"
          :min="10"
          :max="1000"
          :step="10"
          icon="i-heroicons-puzzle-piece"
        />
      </UFormGroup>

      <UFormGroup label="Average Puzzle Rating">
        <UiRange
          v-model="state.rating"
          :min="1000"
          :max="3000"
          :step="25"
          icon="i-heroicons-star"
        />
      </UFormGroup>

      <UFormGroup label="Number of Cycles">
        <UInput
          v-model="state.totalCycles"
          type="number"
          placeholder="Number of cycles"
          :min="1"
          :max="10"
        />
      </UFormGroup>

      <UFormGroup label="Themes">
        <USelectMenu
          v-model="state.themes"
          :options="puzzleThemes"
          searchable
          searchable-placeholder="Search a theme..."
          multiple
          placeholder="Select puzzle themes"
          option-attribute="label"
          value-attribute="value"
        >
          <template #option="{ option: theme }">
            <UTooltip
              :text="theme.description"
              :popper="{
                placement: 'right',
                offsetDistance: 16,
              }"
              :ui="{ base: 'h-fit text-clip' }"
            >
              <span>{{ theme.label }}</span>
            </UTooltip>
          </template>
        </USelectMenu>
      </UFormGroup>
    </div>
  </UiModal>

  <UiModal
    v-model="isMakeDefaultModalOpen"
    @action="makePuzzleSetDefault"
    :loading="isMakeDefaultLoading"
    title="Make Puzzle Set Default"
    buttonText="Make Default"
    buttonColor="primary"
  >
    <p>
      Are you sure you want to set '<strong>{{
        puzzleSetToMakeDefault?.name
      }}</strong
      >' as your default puzzle set? This will replace your current default
      puzzle set.
    </p>
  </UiModal>

  <UiModal
    v-model="isDeleteModalOpen"
    @action="deletePuzzleSet"
    :loading="isDeleteLoading"
    title="Delete Puzzle Set"
    buttonText="Delete"
    buttonColor="primary"
  >
    <p>
      Are you sure you want to permanently delete '<strong>{{
        puzzleSetToDelete?.name
      }}</strong
      >'? This action cannot be reversed.
    </p>
  </UiModal>
</template>

<script setup lang="ts">
const puzzleThemes = [
  {
    label: "Advanced pawn",
    description:
      "One of your pawns is deep into the opponent position, maybe threatening to promote.",
    value: "advancedPawn",
  },
  {
    label: "Advantage",
    description:
      "Seize your chance to get a decisive advantage. (200cp ≤ eval ≤ 600cp)",
    value: "advantage",
  },
  {
    label: "Anastasia's mate",
    description:
      "A knight and rook or queen team up to trap the opposing king between the side of the board and a friendly piece.",
    value: "anastasiaMate",
  },
  {
    label: "Arabian mate",
    description:
      "A knight and a rook team up to trap the opposing king on a corner of the board.",
    value: "arabianMate",
  },
  {
    label: "Attacking f2 or f7",
    description:
      "An attack focusing on the f2 or f7 pawn, such as in the fried liver opening.",
    value: "attackingF2F7",
  },
  {
    label: "Attraction",
    description:
      "An exchange or sacrifice encouraging or forcing an opponent piece to a square that allows a follow-up tactic.",
    value: "attraction",
  },
  {
    label: "Back rank mate",
    description:
      "Checkmate the king on the home rank, when it is trapped there by its own pieces.",
    value: "backRankMate",
  },
  {
    label: "Bishop endgame",
    description: "An endgame with only bishops and pawns.",
    value: "bishopEndgame",
  },
  {
    label: "Boden's mate",
    description:
      "Two attacking bishops on criss-crossing diagonals deliver mate to a king obstructed by friendly pieces.",
    value: "bodenMate",
  },
  {
    label: "Castling",
    description: "Bring the king to safety, and deploy the rook for attack.",
    value: "castling",
  },
  {
    label: "Capture the defender",
    description:
      "Removing a piece that is critical to defence of another piece, allowing the now undefended piece to be captured on a following move.",
    value: "capturingDefender",
  },
  {
    label: "Crushing",
    description:
      "Spot the opponent blunder to obtain a crushing advantage. (eval ≥ 600cp)",
    value: "crushing",
  },
  {
    label: "Double bishop mate",
    description:
      "Two attacking bishops on adjacent diagonals deliver mate to a king obstructed by friendly pieces.",
    value: "doubleBishopMate",
  },
  {
    label: "Dovetail mate",
    description:
      "A queen delivers mate to an adjacent king, whose only two escape squares are obstructed by friendly pieces.",
    value: "dovetailMate",
  },
  {
    label: "Equality",
    description:
      "Come back from a losing position, and secure a draw or a balanced position. (eval ≤ 200cp)",
    value: "equality",
  },
  {
    label: "Kingside attack",
    description:
      "An attack of the opponent's king, after they castled on the king side.",
    value: "kingsideAttack",
  },
  {
    label: "Clearance",
    description:
      "A move, often with tempo, that clears a square, file or diagonal for a follow-up tactical idea.",
    value: "clearance",
  },
  {
    label: "Defensive move",
    description:
      "A precise move or sequence of moves that is needed to avoid losing material or another advantage.",
    value: "defensiveMove",
  },
  {
    label: "Deflection",
    description:
      "A move that distracts an opponent piece from another duty that it performs, such as guarding a key square. Sometimes also called 'overloading'.",
    value: "deflection",
  },
  {
    label: "Discovered attack",
    description:
      "Moving a piece (such as a knight), that previously blocked an attack by a long range piece (such as a rook), out of the way of that piece.",
    value: "discoveredAttack",
  },
  {
    label: "Double check",
    description:
      "Checking with two pieces at once, as a result of a discovered attack where both the moving piece and the unveiled piece attack the opponent's king.",
    value: "doubleCheck",
  },
  {
    label: "Endgame",
    description: "A tactic during the last phase of the game.",
    value: "endgame",
  },
  {
    label: "En passant",
    description:
      "A tactic involving the en passant rule, where a pawn can capture an opponent pawn that has bypassed it using its initial two-square move.",
    value: "enPassant",
  },
  {
    label: "Exposed king",
    description:
      "A tactic involving a king with few defenders around it, often leading to checkmate.",
    value: "exposedKing",
  },
  {
    label: "Fork",
    description:
      "A move where the moved piece attacks two opponent pieces at once.",
    value: "fork",
  },
  {
    label: "Hanging piece",
    description:
      "A tactic involving an opponent piece being undefended or insufficiently defended and free to capture.",
    value: "hangingPiece",
  },
  {
    label: "Hook mate",
    description:
      "Checkmate with a rook, knight, and pawn along with one enemy pawn to limit the enemy king's escape.",
    value: "hookMate",
  },
  {
    label: "Interference",
    description:
      "Moving a piece between two opponent pieces to leave one or both opponent pieces undefended, such as a knight on a defended square between two rooks.",
    value: "interference",
  },
  {
    label: "Intermezzo",
    description:
      "Instead of playing the expected move, first interpose another move posing an immediate threat that the opponent must answer. Also known as 'Zwischenzug' or 'In between'.",
    value: "intermezzo",
  },
  {
    label: "Knight endgame",
    description: "An endgame with only knights and pawns.",
    value: "knightEndgame",
  },
  { label: "Long puzzle", description: "Three moves to win.", value: "long" },
  {
    label: "Master games",
    description: "Puzzles from games played by titled players.",
    value: "master",
  },
  {
    label: "Master vs Master games",
    description: "Puzzles from games between two titled players.",
    value: "masterVsMaster",
  },
  {
    label: "Checkmate",
    description: "Win the game with style.",
    value: "mate",
  },
  {
    label: "Mate in 1",
    description: "Deliver checkmate in one move.",
    value: "mateIn1",
  },
  {
    label: "Mate in 2",
    description: "Deliver checkmate in two moves.",
    value: "mateIn2",
  },
  {
    label: "Mate in 3",
    description: "Deliver checkmate in three moves.",
    value: "mateIn3",
  },
  {
    label: "Mate in 4",
    description: "Deliver checkmate in four moves.",
    value: "mateIn4",
  },
  {
    label: "Mate in 5 or more",
    description: "Figure out a long mating sequence.",
    value: "mateIn5",
  },
  {
    label: "Middlegame",
    description: "A tactic during the second phase of the game.",
    value: "middlegame",
  },
  {
    label: "One-move puzzle",
    description: "A puzzle that is only one move long.",
    value: "oneMove",
  },
  {
    label: "Opening",
    description: "A tactic during the first phase of the game.",
    value: "opening",
  },
  {
    label: "Pawn endgame",
    description: "An endgame with only pawns.",
    value: "pawnEndgame",
  },
  {
    label: "Pin",
    description:
      "A tactic involving pins, where a piece is unable to move without revealing an attack on a higher value piece.",
    value: "pin",
  },
  {
    label: "Promotion",
    description: "Promote one of your pawn to a queen or minor piece.",
    value: "promotion",
  },
  {
    label: "Queen endgame",
    description: "An endgame with only queens and pawns.",
    value: "queenEndgame",
  },
  {
    label: "Queen and Rook",
    description: "An endgame with only queens, rooks and pawns.",
    value: "queenRookEndgame",
  },
  {
    label: "Queenside attack",
    description:
      "An attack of the opponent's king, after they castled on the queen side.",
    value: "queensideAttack",
  },
  {
    label: "Quiet move",
    description:
      "A move that does neither make a check or capture, nor an immediate threat to capture, but does prepare a more hidden unavoidable threat for a later move.",
    value: "quietMove",
  },
  {
    label: "Rook endgame",
    description: "An endgame with only rooks and pawns.",
    value: "rookEndgame",
  },
  {
    label: "Sacrifice",
    description:
      "A tactic involving giving up material in the short-term, to gain an advantage again after a forced sequence of moves.",
    value: "sacrifice",
  },
  { label: "Short puzzle", description: "Two moves to win.", value: "short" },
  {
    label: "Skewer",
    description:
      "A motif involving a high value piece being attacked, moving out the way, and allowing a lower value piece behind it to be captured or attacked, the inverse of a pin.",
    value: "skewer",
  },
  {
    label: "Smothered mate",
    description:
      "A checkmate delivered by a knight in which the mated king is unable to move because it is surrounded (or smothered) by its own pieces.",
    value: "smotheredMate",
  },
  {
    label: "Super GM games",
    description: "Puzzles from games played by the best players in the world.",
    value: "superGM",
  },
  {
    label: "Trapped piece",
    description: "A piece is unable to escape capture as it has limited moves.",
    value: "trappedPiece",
  },
  {
    label: "Underpromotion",
    description: "Promotion to a knight, bishop, or rook.",
    value: "underPromotion",
  },
  {
    label: "Very long puzzle",
    description: "Four moves or more to win.",
    value: "veryLong",
  },
  {
    label: "X-Ray attack",
    description: "A piece attacks or defends a square, through an enemy piece.",
    value: "xRayAttack",
  },
  {
    label: "Zugzwang",
    description:
      "The opponent is limited in the moves they can make, and all moves worsen their position.",
    value: "zugzwang",
  },
];

const state = reactive({
  name: "",
  numberOfPuzzles: 10,
  rating: 800,
  totalCycles: 3,
  themes: puzzleThemes.map((theme) => theme.value),
});

const notifications = useNotification();
const {
  data,
  status,
  error,
  refresh: refreshPuzzleSets,
  clear,
} = await useFetchPuzzleSets();

refreshPuzzleSets();

const { createPuzzleSet: create } = useCreatePuzzleSet();
const { refreshDefaultPuzzleSet } = useFetchDefaultPuzzleSet();
const { makePuzzleSetDefault: makeDefault } = useMakePuzzleSetDefault();
const { deletePuzzleSet: _delete } = useDeletePuzzleSet();

const isCreateModalOpen = ref(false);
const isCreateLoading = ref(false);

const isMakeDefaultModalOpen = ref(false);
const isMakeDefaultLoading = ref(false);
const puzzleSetToMakeDefault: Ref<PuzzleSet | null> = ref(null);

const isDeleteModalOpen = ref(false);
const isDeleteLoading = ref(false);
const puzzleSetToDelete: Ref<PuzzleSet | null> = ref(null);

const tableColumns = [
  {
    label: "Name",
    key: "name",
    class: "min-w-36 w-1/4", // flexible but has a min width
  },
  {
    key: "is_default",
    class: "w-fit text-center", // small boolean column
  },
  {
    label: "Progress",
    key: "cycles",
    icon: "i-heroicons-arrows-arrow-path",
    class: "min-w-[100px] w-1/4", // progress info
  },
  {
    label: "Created at",
    key: "created_at",
    class: "hidden sm:table-cell w-1/4", // hide on very small screens
    rowClass: "hidden sm:table-cell p-2", // hide on very small screens
  },
  {
    key: "actions",
    class: "w-12",
    rowClass: "w-12 min-w-12 max-w-12", // hide on very small screens
  },
];

const createPuzzleSet = async () => {
  isCreateLoading.value = true;
  try {
    await create(state);

    notifications.success({
      title: "Puzzle set created",
      message: "Your puzzle set has been created successfully.",
    });

    isCreateModalOpen.value = false;
  } catch (error: any) {
    notifications.error({
      title: "Error creating puzzle set",
      message: error.data.message,
    });
  }

  isCreateLoading.value = false;

  await refreshDefaultPuzzleSet();
  await refreshPuzzleSets();
};

const makePuzzleSetDefault = async () => {
  if (!puzzleSetToMakeDefault.value) {
    return;
  }

  isMakeDefaultLoading.value = true;
  try {
    await makeDefault(puzzleSetToMakeDefault.value.slug);

    notifications.success({
      title: "Puzzle set made default",
      message: "Your puzzle set has been made the default successfully.",
    });

    isMakeDefaultModalOpen.value = false;
  } catch (error: any) {
    notifications.error({
      title: "Error making puzzle set default",
      message: error.data.message,
    });
  }

  isMakeDefaultLoading.value = false;

  await refreshDefaultPuzzleSet();
  await refreshPuzzleSets();
};

const deletePuzzleSet = async () => {
  if (!puzzleSetToDelete.value) {
    return;
  }

  isDeleteLoading.value = true;
  try {
    await _delete(puzzleSetToDelete.value.slug);

    notifications.success({
      title: "Puzzle set deleted",
      message: "Your puzzle set has been deleted successfully.",
    });

    isDeleteModalOpen.value = false;
  } catch (error: any) {
    notifications.error({
      title: "Error deleting puzzle set",
      message: error.data.message,
    });
  }

  isDeleteLoading.value = false;

  await refreshPuzzleSets();
};
</script>
