import type { Database } from "./database.types";

type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

// Users
export type Profile = Omit<TableRow<"profiles">, "created_at">;

// Puzzles
export type Puzzle = TableRow<"puzzles">;

export type PuzzleStatus =
  | "notStarted"
  | "inProgressCorrect"
  | "inProgressIncorrect"
  | "solved";

// Puzzle Sets
export type PuzzleSet = Omit<TableRow<"puzzle_sets">, "created_at">;

export type PuzzleSetWithPuzzles = PuzzleSet & {
  puzzles: Puzzle[];
};

export type PuzzleSetWithProgress = PuzzleSet & {
  progress: PuzzleSetProgress;
};

export type PuzzleSetProgress = {
  total_puzzles: number;
  solved_in_current_cycle: number;
  solved_correctly_in_current_cycle: number;
  solved_incorrectly_in_current_cycle: number;
  current_cycle: number;
  total_cycles: number;
  total_correct_solves: number;
  total_incorrect_solves: number;
};

export type PuzzleSetPuzzle = TableRow<"puzzle_set_puzzles">;

export type PuzzleSetPuzzleProgress = {
  incorrect_solves: number;
  correct_solves: number;
};

export type ChessBoardAPI = {
  setPosition: (fen: string) => void;
  makeMove: (move: string) => void;
  resetBoard: () => void;
  clearBoard: () => void;
  undoLastMove: () => void;
};
