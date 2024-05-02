import * as module from "./getTasks";
import { _buildTasksApiQueryString, _escapeFilter } from "./getTasks";

describe(`${_buildTasksApiQueryString.name}()`, () => {
  const projectName = "Project";
  const sectionName = "Section";

  beforeEach(() => {
    vi.spyOn(module, "_projectIdToName").mockResolvedValue(projectName);
    vi.spyOn(module, "_sectionIdToName").mockResolvedValue(sectionName);
  });
  const cases: {
    name: string;
    input: Parameters<typeof _buildTasksApiQueryString>[0];
    expected: Awaited<ReturnType<typeof _buildTasksApiQueryString>>;
  }[] = [
    {
      name: "filterByDueByToday === false && sectionId === undefined",
      input: { projectId: "100", filterByDueByToday: false, sectionId: undefined },
      expected: `?${new URLSearchParams({ filter: `#${projectName}` })}`,
    },
    {
      name: "sectionId is a string",
      input: { projectId: "100", filterByDueByToday: false, sectionId: "200" },
      expected: `?${new URLSearchParams({ filter: `#${projectName} & /${sectionName}` })}`,
    },
    {
      name: "filterByDueByToday is true",
      input: { projectId: "100", filterByDueByToday: true, sectionId: undefined },
      expected: `?${new URLSearchParams({ filter: `(today | overdue) & #${projectName}` })}`,
    },
  ];
  test.each(cases)("$name", async ({ input, expected }) =>
    expect(await _buildTasksApiQueryString(input)).toBe(expected),
  );
});

test(`${_escapeFilter.name}()`, () =>
  expect(_escapeFilter("foo & bar & baz")).toBe("foo \\& bar \\& baz"));
