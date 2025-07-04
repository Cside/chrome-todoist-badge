import type { Api } from "../../../../types";
import { groupTasksByProject, groupTasksBySection } from "./utils";

describe(`${groupTasksBySection.name}()`, () => {
  const SECTION_1: Api.Section = { id: "sec-100", name: "Section 1", order: 0 };
  const SECTION_2: Api.Section = { id: "sec-200", name: "Section 2", order: 1 };

  const toTask = (task: Pick<Api.Task, "id" | "order" | "sectionId">): Api.Task => ({
    ...task,
    content: "",
    url: "",
    projectId: "project-100",
  });

  const cases: {
    name: string;
    input: Parameters<typeof groupTasksBySection>[0];
    expected: ReturnType<typeof groupTasksBySection>;
  }[] = [
    {
      name: "basic",
      input: {
        tasks: [
          toTask({ id: "id-100", order: 1, sectionId: "sec-100" }),
          toTask({ id: "id-200", order: 2, sectionId: undefined }),
          toTask({ id: "id-300", order: 3, sectionId: undefined }),
          toTask({ id: "id-400", order: 4, sectionId: "sec-100" }),
          toTask({ id: "id-500", order: 50, sectionId: "sec-200" }),
          toTask({ id: "id-600", order: 6, sectionId: "sec-200" }),
        ],
        sections: [SECTION_2, SECTION_1],
      },
      expected: [
        {
          section: undefined,
          tasks: [
            toTask({ id: "id-200", order: 2, sectionId: undefined }),
            toTask({ id: "id-300", order: 3, sectionId: undefined }),
          ],
        },
        {
          section: SECTION_1,
          tasks: [
            toTask({ id: "id-100", order: 1, sectionId: "sec-100" }),
            toTask({ id: "id-400", order: 4, sectionId: "sec-100" }),
          ],
        },
        {
          section: SECTION_2,
          tasks: [
            toTask({ id: "id-600", order: 6, sectionId: "sec-200" }),
            toTask({ id: "id-500", order: 50, sectionId: "sec-200" }),
          ],
        },
      ],
    },
    {
      name: "empty tasks",
      input: { tasks: [], sections: [] },
      expected: [],
    },
    {
      name: "empty section",
      input: {
        tasks: [toTask({ id: "id-100", order: 0, sectionId: undefined })],
        sections: [SECTION_1],
      },
      expected: [
        {
          section: undefined,
          tasks: [toTask({ id: "id-100", order: 0, sectionId: undefined })],
        },
      ],
    },
    {
      name: "only undefined sections",
      input: {
        tasks: [toTask({ id: "id-100", order: 0, sectionId: undefined })],
        sections: [],
      },
      expected: [
        {
          section: undefined,
          tasks: [toTask({ id: "id-100", order: 0, sectionId: undefined })],
        },
      ],
    },
    {
      name: "section doesn't exist",
      input: {
        tasks: [
          toTask({ id: "id-100", order: 0, sectionId: undefined }),
          toTask({ id: "id-200", order: 1, sectionId: "nullSection" }),
        ],
        sections: [],
      },
      expected: [
        {
          section: undefined,
          tasks: [toTask({ id: "id-100", order: 0, sectionId: undefined })],
        },
      ],
    },
  ];
  test.each(cases)("$name", ({ input, expected }) =>
    expect(groupTasksBySection(input)).toEqual(expected),
  );
});

describe(`${groupTasksByProject.name}()`, () => {
  const PROJECT_1: Api.Project = { id: "project-100", name: "Project 1", order: 0 };

  const toTask = (task: Pick<Api.Task, "id" | "order" | "projectId">): Api.Task => ({
    ...task,
    content: "",
    url: "",
    sectionId: "section-200",
  });

  const cases: {
    name: string;
    input: Parameters<typeof groupTasksByProject>[0];
    expected: ReturnType<typeof groupTasksByProject>;
  }[] = [
    {
      name: "basic",
      input: {
        tasks: [toTask({ id: "id-100", order: 0, projectId: "project-100" })],
        projects: [PROJECT_1],
      },
      expected: [
        {
          project: PROJECT_1,
          tasks: [toTask({ id: "id-100", order: 0, projectId: "project-100" })],
        },
      ],
    },
    {
      name: "存在しない project id は除外する（project を消しても、しばらく API 側でキャッシュされる可能性あるので）",
      input: {
        tasks: [toTask({ id: "id-100", order: 0, projectId: "nullProject" })],
        projects: [],
      },
      expected: [],
    },
  ];
  test.each(cases)("$name", ({ input, expected }) =>
    expect(groupTasksByProject(input)).toEqual(expected),
  );
});
