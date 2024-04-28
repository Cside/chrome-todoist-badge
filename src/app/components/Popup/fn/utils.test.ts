import type { Section, Task } from "../../../../types";
import { groupTasksBySectionId } from "./utils";

const SECTION1: Section = { id: "sec-100", name: "Section 1", order: 0 };
const SECTION2: Section = { id: "sec-200", name: "Section 2", order: 1 };

const toTask = (task: Pick<Task, "id" | "order" | "sectionId">): Task => ({
  ...task,
  content: "",
  url: "",
});

describe(`${groupTasksBySectionId.name}()`, () => {
  const cases: {
    name: string;
    input: Parameters<typeof groupTasksBySectionId>[0];
    expected: ReturnType<typeof groupTasksBySectionId>;
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
        sections: [SECTION1, SECTION2],
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
          section: SECTION1,
          tasks: [
            toTask({ id: "id-100", order: 1, sectionId: "sec-100" }),
            toTask({ id: "id-400", order: 4, sectionId: "sec-100" }),
          ],
        },
        {
          section: SECTION2,
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
        sections: [SECTION1],
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
  ];
  test.each(cases)("$name", ({ input, expected }) =>
    expect(groupTasksBySectionId(input)).toEqual(expected),
  );
});
