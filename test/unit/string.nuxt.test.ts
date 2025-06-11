import { expect, test, describe } from "vitest";
import { slugify } from "../../server/utils/string";

describe("slugify", () => {
  test("converts spaces to hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  test("removes special characters", () => {
    expect(slugify("hello@world!")).toBe("helloworld");
  });

  test("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("trims hyphens from start and end", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
    expect(slugify("---hello world---")).toBe("hello-world");
  });

  test("replaces multiple spaces and hyphens with a single hyphen", () => {
    expect(slugify("hello    world")).toBe("hello-world");
    expect(slugify("hello----world")).toBe("hello-world");
    expect(slugify("hello - - world")).toBe("hello-world");
  });

  test("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  test("handles strings with only special characters", () => {
    expect(slugify("!@#$%^&*()")).toBe("");
  });

  test("handles strings with numbers", () => {
    expect(slugify("Chess 2024!")).toBe("chess-2024");
  });

  test("handles underscores", () => {
    expect(slugify("hello_world")).toBe("hello_world");
  });
});
