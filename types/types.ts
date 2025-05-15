import type { Database } from "./database.types";

type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

// Users
export type Profile = Omit<TableRow<"profiles">, "created_at">;

// Puzzles
export type Puzzle = TableRow<"puzzles">;

// Puzzle Sets
export type PuzzleSet = Omit<TableRow<"puzzle_sets">, "created_at"> & {
  puzzles: Puzzle[];
};

export type PuzzleSetPuzzle = Omit<
  TableRow<"puzzle_set_puzzles">,
  "id" | "is_solved"
>;

export type ChessBoardAPI = {
  setPosition: (fen: string) => void;
  makeMove: (move: string) => void;
  resetBoard: () => void;
  clearBoard: () => void;
  undoLastMove: () => void;
};
