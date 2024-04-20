import type { Task } from "@/src/api/types";
import type { TasksGroupedBySection } from "../types";
import { groupTasksBySectionId } from "./utils";

describe(`${groupTasksBySectionId.name}()`, () => {
  const cases: { input: Task[]; expected: TasksGroupedBySection }[] = [
    {
      input: [
        { id: "id-100", sectionId: "sec-100", content: "" },
        { id: "id-200", sectionId: null, content: "" },
        { id: "id-300", sectionId: null, content: "" },
        { id: "id-400", sectionId: "sec-100", content: "" },
        { id: "id-500", sectionId: "sec-200", content: "" },
        { id: "id-600", sectionId: "sec-200", content: "" },
      ],
      expected: [
        {
          sectionId: null,
          tasks: [
            { id: "id-200", sectionId: null, content: "" },
            { id: "id-300", sectionId: null, content: "" },
          ],
        },
        {
          sectionId: "sec-100",
          tasks: [
            { id: "id-100", sectionId: "sec-100", content: "" },
            { id: "id-400", sectionId: "sec-100", content: "" },
          ],
        },
        {
          sectionId: "sec-200",
          tasks: [
            { id: "id-500", sectionId: "sec-200", content: "" },
            { id: "id-600", sectionId: "sec-200", content: "" },
          ],
        },
      ],
    },
    {
      input: [],
      expected: [],
    },
    {
      input: [{ id: "id-100", sectionId: null, content: "" }],
      expected: [
        {
          sectionId: null,
          tasks: [{ id: "id-100", sectionId: null, content: "" }],
        },
      ],
    },
  ];
  test.each(cases)("$name", ({ input, expected }) =>
    expect(groupTasksBySectionId(input)).toEqual(expected),
  );
});
