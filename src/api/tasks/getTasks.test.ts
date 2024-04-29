import { _buildTasksApiQueryString, _escapeFilter } from "./getTasks";

describe(`${_buildTasksApiQueryString.name}()`, () => {
  const cases: {
    name: string;
    input: Parameters<typeof _buildTasksApiQueryString>[0];
    expected: ReturnType<typeof _buildTasksApiQueryString>[0];
  }[] = [
    {
      name: "filterByDueByToday and sectionId are falsy",
      input: { projectId: "100", filterByDueByToday: false, sectionId: undefined },
      expected: "?project_id=100",
    },
    {
      name: "sectionId is a string",
      input: { projectId: "100", filterByDueByToday: false, sectionId: "200" },
      expected: "?project_id=100&section_id=200",
    },
    {
      name: "filterByDueByToday is true",
      input: { projectId: "100", filterByDueByToday: true, sectionId: undefined },
      expected: `?project_id=100&filter=today${encodeURIComponent("|")}overdue`,
    },
  ];
  test.each(cases)("$name", ({ input, expected }) =>
    expect(_buildTasksApiQueryString(input)).toBe(expected),
  );
});

test(`${_escapeFilter.name}()`, () =>
  expect(_escapeFilter("foo & bar & baz")).toBe("foo \\& bar \\& baz"));
