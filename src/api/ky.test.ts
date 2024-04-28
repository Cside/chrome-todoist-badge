import { normalizeApiObject } from "./ky";

describe(`${normalizeApiObject.name}()`, () => {
  const groupedCases: Record<
    string,
    {
      name: string;
      input: Parameters<typeof normalizeApiObject>[0];
      expected: ReturnType<typeof normalizeApiObject>;
    }[]
  > = {
    camelize: [
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
    ],
    "null -> undefined": [
      {
        name: "flat",
        input: {
          foo: null,
          bar: { baz: null },
          foobar: [null],
        },
        expected: {
          foo: undefined,
          bar: { baz: undefined },
          foobar: [undefined],
        },
      },
      {
        name: "array",
        input: [null],
        expected: [undefined],
      },
    ],
  };
  for (const [description, cases] of Object.entries(groupedCases)) {
    describe(description, () => {
      test.each(cases)("$name", ({ input, expected }) =>
        expect(normalizeApiObject(input)).toEqual(expected),
      );
    });
  }
});
