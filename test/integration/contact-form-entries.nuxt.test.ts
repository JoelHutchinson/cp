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
import { createContactFormEntry } from "~/server/utils/contact-form-entries";
import { serverSupabaseClient } from "#supabase/server";

const mockEntry = {
  id: "123",
  profile_id: null,
  username: "bish",
  first_name: "John",
  last_name: "Smith",
  email: "bish@bish.com",
  subject: "Test",
  message: "Hello world",
};

vi.mock("#supabase/server", () => ({
  serverSupabaseClient: vi.fn(),
}));

describe("createContactFormEntry", () => {
  let event: H3Event;
  let fromMock: Mock;
  let insertMock: Mock;

  beforeEach(() => {
    event = {} as H3Event;

    const singleMock = vi.fn().mockResolvedValue({
      data: mockEntry,
      error: null,
    });

    const selectMock = vi.fn(() => ({
      single: singleMock,
    }));

    insertMock = vi.fn(() => ({
      select: selectMock,
    }));

    fromMock = vi.fn(() => ({
      insert: insertMock,
    }));

    (serverSupabaseClient as Mock).mockResolvedValue({
      from: fromMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should insert contact form entry and return the result", async () => {
    const result = await createContactFormEntry(event, {
      contactFormEntry: mockEntry,
    });

    expect(result).toEqual(mockEntry);
    expect(fromMock).toHaveBeenCalledWith("contact_form_entries");
    expect(insertMock).toHaveBeenCalledWith(mockEntry);
  });
});
