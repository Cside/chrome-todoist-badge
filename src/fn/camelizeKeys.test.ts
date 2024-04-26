import { camelizeKeys } from "./camelizeKeys";

describe(`${camelizeKeys.name}()`, () => {
  test.each([
    {
      name: "flat",
      input: {
        snake_case_1: 1,
        snake_case_2: 2,
        camelCase: 3,
      },
      expected: {
        snakeCase1: 1,
        snakeCase2: 2,
        camelCase: 3,
      },
    },
    {
      name: "array",
      input: [{ snake_case_1: 1 }],
      expected: [{ snakeCase1: 1 }],
    },
    {
      name: "deep",
      input: {
        snake_case_1: {
          snake_case_2: [{ snake_case_3: 3 }, { snake_case_4: 4 }],
        },
      },
      expected: {
        snakeCase1: {
          snakeCase2: [{ snakeCase3: 3 }, { snakeCase4: 4 }],
        },
      },
    },
  ])("$name", ({ input, expected }) => expect(camelizeKeys(input)).toEqual(expected));
});
