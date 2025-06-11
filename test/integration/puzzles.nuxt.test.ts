// @vitest-environment nuxt
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import type { H3Event } from "h3";
import { fetchPuzzleById } from "~/server/utils/puzzles"; // adjust this path as needed
import { serverSupabaseClient } from "#supabase/server";

const mockPuzzle = {
  id: "abc123",
  title: "Knight Fork",
  fen: "r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  solution: ["Nxe5"],
};

vi.mock("#supabase/server", () => ({
  serverSupabaseClient: vi.fn(),
}));

describe("fetchPuzzleById", () => {
  let event: H3Event;
  let fromMock: Mock;
  let matchMock: Mock;
  let selectMock: Mock;

  beforeEach(() => {
    event = {} as H3Event;

    const singleMock = vi.fn().mockResolvedValue({
      data: mockPuzzle,
      error: null,
    });

    matchMock = vi.fn(() => ({
      single: singleMock,
    }));

    selectMock = vi.fn(() => ({
      match: matchMock,
    }));

    fromMock = vi.fn(() => ({
      select: selectMock,
    }));

    (serverSupabaseClient as Mock).mockResolvedValue({
      from: fromMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch a puzzle by ID and return the result", async () => {
    const result = await fetchPuzzleById(event, { id: mockPuzzle.id });

    expect(result).toEqual(mockPuzzle);
    expect(fromMock).toHaveBeenCalledWith("puzzles");
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(matchMock).toHaveBeenCalledWith({ id: mockPuzzle.id });
  });

  it("should throw an error if Supabase returns an error", async () => {
    // override the single() mock to return an error
    matchMock.mockReturnValueOnce({
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Puzzle not found" },
      }),
    });

    await expect(fetchPuzzleById(event, { id: "nonexistent" })).rejects.toThrow(
      /Error fetching puzzle/
    );
  });
});
