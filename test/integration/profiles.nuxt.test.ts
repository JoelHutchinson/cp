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
import { fetchProfileById } from "~/server/utils/profiles"; // adjust path as needed
import { serverSupabaseClient } from "#supabase/server";

const mockProfile = {
  id: "abc123",
  username: "bish",
  first_name: "John",
  last_name: "Smith",
  email: "bish@bish.com",
};

const mockProfiles = [
  mockProfile,
  {
    id: "def456",
    username: "mary",
    first_name: "Mary",
    last_name: "Jones",
    email: "mary@mary.com",
  },
];

vi.mock("#supabase/server", () => ({
  serverSupabaseClient: vi.fn(),
}));

describe("profiles utils", () => {
  let event: H3Event;
  let fromMock: Mock;
  let selectMock: Mock;
  let matchMock: Mock;
  let singleMock: Mock;

  beforeEach(() => {
    event = {} as H3Event;

    singleMock = vi.fn().mockResolvedValue({
      data: mockProfile,
      error: null,
    });

    matchMock = vi.fn(() => ({
      single: singleMock,
    }));

    selectMock = vi.fn(() => ({
      match: matchMock,
      // for fetchProfiles, select returns data directly without match
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

  describe("fetchProfileById", () => {
    it("should fetch a profile by id and return data", async () => {
      const result = await fetchProfileById(event, { id: "abc123" });

      expect(result).toEqual(mockProfile);
      expect(fromMock).toHaveBeenCalledWith("profiles");
      expect(selectMock).toHaveBeenCalledWith("*");
      expect(matchMock).toHaveBeenCalledWith({ id: "abc123" });
      expect(singleMock).toHaveBeenCalled();
    });

    it("should throw an error if supabase returns an error", async () => {
      const error = new Error("Fetch failed");

      singleMock.mockResolvedValueOnce({
        data: null,
        error,
      });

      await expect(fetchProfileById(event, { id: "abc123" })).rejects.toThrow(
        `Error fetching profile. (Message: Fetch failed)`
      );
    });
  });

  describe("fetchProfiles", () => {
    it("should fetch all profiles and return data", async () => {
      // For fetchProfiles, select returns { data, error } directly, no match or single
      selectMock.mockResolvedValueOnce({
        data: mockProfiles,
        error: null,
      });

      // Also, no match() or single() call expected here
      // So fromMock().select() returns a Promise directly

      // Adjust mocks accordingly:
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: mockProfiles,
          error: null,
        }),
      });

      const result = await fetchProfiles(event);

      expect(result).toEqual(mockProfiles);
      expect(fromMock).toHaveBeenCalledWith("profiles");
      expect(selectMock).not.toHaveBeenCalled(); // since we replaced select mock above
    });

    it("should throw an error if supabase returns an error", async () => {
      const error = new Error("Fetch all failed");

      fromMock.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: null,
          error,
        }),
      });

      await expect(fetchProfiles(event)).rejects.toThrow(
        `Error fetching profiles. (Message: Fetch all failed)`
      );
    });
  });
});
