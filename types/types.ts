import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Puzzle = Database["public"]["Tables"]["puzzles"]["Row"];

export type ChessBoardAPI = {
  setPosition: (fen: string) => void;
  makeMove: (move: string) => void;
  resetBoard: () => void;
  clearBoard: () => void;
  undoLastMove: () => void;
};
