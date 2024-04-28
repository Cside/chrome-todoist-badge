import { groupTasksBySectionId } from "./utils";

const SECTION1 = { id: "sec-100", name: "Section 1", order: 0 };
const SECTION2 = { id: "sec-200", name: "Section 2", order: 1 };

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
          { id: "id-100", order: 1, sectionId: "sec-100", content: "" },
          { id: "id-200", order: 2, sectionId: undefined, content: "" },
          { id: "id-300", order: 3, sectionId: undefined, content: "" },
          { id: "id-400", order: 4, sectionId: "sec-100", content: "" },
          { id: "id-500", order: 50, sectionId: "sec-200", content: "" },
          { id: "id-600", order: 6, sectionId: "sec-200", content: "" },
        ],
        sections: [SECTION1, SECTION2],
      },
      expected: [
        {
          section: undefined,
          tasks: [
            { id: "id-200", order: 2, sectionId: undefined, content: "" },
            { id: "id-300", order: 3, sectionId: undefined, content: "" },
          ],
        },
        {
          section: SECTION1,
          tasks: [
            { id: "id-100", order: 1, sectionId: "sec-100", content: "" },
            { id: "id-400", order: 4, sectionId: "sec-100", content: "" },
          ],
        },
        {
          section: SECTION2,
          tasks: [
            { id: "id-600", order: 6, sectionId: "sec-200", content: "" },
            { id: "id-500", order: 50, sectionId: "sec-200", content: "" },
          ],
        },
      ],
    },
    {
      name: "empty",
      input: { tasks: [], sections: [] },
      expected: [],
    },
    {
      name: "only undefined sections",
      input: {
        tasks: [{ id: "id-100", order: 0, sectionId: undefined, content: "" }],
        sections: [],
      },
      expected: [
        {
          section: undefined,
          tasks: [{ id: "id-100", order: 0, sectionId: undefined, content: "" }],
        },
      ],
    },
  ];
  test.each(cases)("$name", ({ input, expected }) =>
    expect(groupTasksBySectionId(input)).toEqual(expected),
  );
});
