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

  <!-- Puzzle Set Table -->
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

  <!-- Puzzle Set Create Modal -->
  <UiModal
    key="create-puzzle-set-modal"
    v-model="isCreateModalOpen"
    @action="createPuzzleSet"
    :loading="isCreateLoading"
    title="Create a puzzle set"
    buttonText="Create"
    buttonColor="primary"
    prevent-close
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
        <UButton
          color="primary"
          variant="soft"
          trailing-icon="i-heroicons-tag-20-solid"
          @click="isThemeSelectorModalOpen = true"
          block
          >{{ state.themes.length }} Themes Selected</UButton
        >
      </UFormGroup>
    </div>
  </UiModal>

  <!-- Puzzle Set Make Default Modal -->
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

  <!-- Puzzle Set Delete Modal -->
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

  <!-- Puzzle Set Theme Selector Modal -->
  <UiModal
    v-model="isThemeSelectorModalOpen"
    title="Select Puzzle Set Themes"
    buttonText="Done"
    buttonColor="primary"
    @action="selectThemes"
    :ui="{
      width: 'md:max-w-3xl lg:max-w-6xl',
    }"
    :card-ui="{
      base: 'overflow-y-auto max-h-[95vh]',
    }"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="group in PUZZLE_THEME_GROUPS">
          <UButton
            class="mb-4"
            variant="link"
            :color="
              selectedThemes.length &&
              group.themes.some((t) => selectedThemes.includes(t.value))
                ? 'primary'
                : 'gray'
            "
            @click="toggleThemeGroup(group.label)"
          >
            {{ group.label }}
          </UButton>

          <UiTagSelect
            v-model="selectedThemes"
            :options="group.themes"
            option-attribute="label"
            value-attribute="value"
          />
        </div>
      </div>

      <div class="self-end">
        <UButton
          color="primary"
          variant="ghost"
          trailing-icon="i-heroicons-cursor-arrow-rays-20-solid"
          size="xs"
          class="ml-auto"
          @click="selectedThemes = PUZZLE_THEMES.map((t) => t.value)"
        >
          Select All
        </UButton>

        <UButton
          color="primary"
          variant="ghost"
          trailing-icon="i-heroicons-x-mark"
          size="xs"
          @click="selectedThemes = []"
        >
          Deselect All
        </UButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { PUZZLE_THEMES, PUZZLE_THEME_GROUPS } from "~/utils/constants";

const state = reactive({
  name: "",
  numberOfPuzzles: 10,
  rating: 800,
  totalCycles: 3,
  themes: PUZZLE_THEMES.map((t) => t.value),
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

const isThemeSelectorModalOpen = ref(false);
const selectedThemes = ref<string[]>(state.themes);

const tableColumns = [
  {
    label: "Name",
    key: "name",
    class: "min-w-36 w-1/4",
  },
  {
    key: "is_default",
    class: "w-fit text-center",
  },
  {
    label: "Progress",
    key: "cycles",
    icon: "i-heroicons-arrows-arrow-path",
    class: "min-w-[100px] w-1/4",
  },
  {
    label: "Created at",
    key: "created_at",
    class: "hidden sm:table-cell w-1/4",
    rowClass: "hidden sm:table-cell p-2",
  },
  {
    key: "actions",
    class: "w-12",
    rowClass: "w-12 min-w-12 max-w-12",
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

const selectThemes = () => {
  state.themes = selectedThemes.value;
  isThemeSelectorModalOpen.value = false;
};

const toggleThemeGroup = (group: string) => {
  const groupThemes = PUZZLE_THEME_GROUPS.find(
    (g) => g.label === group
  )?.themes.map((t) => t.value);

  if (!groupThemes) return;

  const anySelected = groupThemes.some((theme) =>
    selectedThemes.value.includes(theme)
  );

  if (anySelected) {
    // Deselect all in the group
    selectedThemes.value = selectedThemes.value.filter(
      (t) => !groupThemes.includes(t)
    );
  } else {
    // Select all in the group (add, avoiding duplicates)
    selectedThemes.value = Array.from(
      new Set([...selectedThemes.value, ...groupThemes])
    );
  }
};
</script>
