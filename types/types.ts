import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Puzzle = {
  id: string;
  fen: string;
  solution: string;
  rating: number;
  tags: string[];
};
