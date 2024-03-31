import { _buildTasksApiQueryString } from "./api";

describe(`${_buildTasksApiQueryString.name}()`, () => {
  const cases: {
    name: string;
    input: Parameters<typeof _buildTasksApiQueryString>[0];
    expected: ReturnType<typeof _buildTasksApiQueryString>[0];
  }[] = [
    {
      name: "no params",
      input: { projectId: undefined, filterByDueByToday: false },
      expected: "",
    },
    {
      name: "filterByDueByToday: true",
      input: { projectId: undefined, filterByDueByToday: true },
      expected: `?filter=today${encodeURIComponent("|")}overdue`,
    },
    {
      name: "123456789012345678901234567890123456789012345678901234567890",
      input: { projectId: "100", filterByDueByToday: false },
      expected: "?project_id=100",
    },
    {
      name: "has projectId && filterByDueByToday: true",
      input: { projectId: "100", filterByDueByToday: true },
      expected: `?project_id=100&filter=today${encodeURIComponent("|")}overdue`,
    },
  ];
  test.each(cases)("$name", ({ input, expected }) =>
    expect(_buildTasksApiQueryString(input)).toBe(expected),
  );
});
