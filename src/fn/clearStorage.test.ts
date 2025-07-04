import { removeQueryParams } from "./clearStorage";

describe(`${removeQueryParams.name}()`, () => {
  const testCases: { input: string; expected: string }[] = [
    {
      input: "https://example.com/path?query=1",
      expected: "https://example.com/path",
    },
    {
      input: "/path?query=1",
      expected: "/path",
    },
    {
      input: "/path",
      expected: "/path",
    },
    {
      input: "/",
      expected: "/",
    },
    {
      input: "https://example.com",
      expected: "https://example.com",
    },
  ];
  test.each(testCases)("$input -> $expected", ({ input, expected }) =>
    expect(removeQueryParams(input)).toBe(expected),
  );
});
