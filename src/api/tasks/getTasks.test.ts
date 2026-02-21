import type { Api } from "../../types";
import * as getProject from "../projects/getProject";
import * as getSection from "../sections/getSection";
import { _buildFilter, _escapeFilter } from "./getTasks";

describe(`${_buildFilter.name}()`, () => {
  const projectName = "Project";
  const sectionName = "Section";

  beforeEach(() => {
    vi.spyOn(getProject, "getProject").mockResolvedValue({
      name: projectName,
    } as Api.Project);
    vi.spyOn(getSection, "getSection").mockResolvedValue({
      name: sectionName,
    } as Api.Project);
  });
  const cases: {
    name: string;
    input: Parameters<typeof _buildFilter>[0];
    expected: Awaited<ReturnType<typeof _buildFilter>>;
  }[] = [
    {
      name: "filterByDueByToday === false && sectionId === undefined",
      input: {
        projectId: "100",
        filterByDueByToday: false,
        sectionId: undefined,
      },
      expected: [true, `#${projectName}`],
    },
    {
      name: "sectionId is a string",
      input: {
        projectId: "100",
        filterByDueByToday: false,
        sectionId: "200",
      },
      expected: [true, `#${projectName} & /${sectionName}`],
    },
    {
      name: "filterByDueByToday is true",
      input: {
        projectId: "100",
        filterByDueByToday: true,
        sectionId: undefined,
      },
      expected: [true, `(today | overdue) & #${projectName}`],
    },
    {
      name: "all projects",
      input: {
        projectId: undefined,
        filterByDueByToday: false,
        sectionId: undefined,
      },
      expected: [false, undefined],
    },
    {
      name: "all projects + Due by today",
      input: {
        projectId: undefined,
        filterByDueByToday: true,
        sectionId: undefined,
      },
      expected: [true, "(today | overdue)"],
    },
  ];
  test.each(cases)("$name", async ({ input, expected }) =>
    expect(await _buildFilter(input)).toEqual(expected),
  );
});

// https://www.notion.so/18ccb33a6a1f8095bef8e41a751d8200?pvs=4#18ccb33a6a1f8031987dfe3964752b7c
test(`${_escapeFilter.name}()`, () =>
  expect(_escapeFilter("foo, bar, baz & foobar (vol #3)")).toBe(
    "foo\\, bar\\, baz \\& foobar \\(vol \\#3\\)",
  ));
