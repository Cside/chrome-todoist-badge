test("...", () => {
  expect(1).toBe(1);
});

//import { _buildTasksApiQueryString } from "./api";
//
//describe(`${_buildTasksApiQueryString.name}()`, () => {
//  const cases: {
//    name: string;
//    input: Parameters<typeof _buildTasksApiQueryString>;
//    expected: string;
//  }[] = [
//    {
//      name: "no params",
//      input: { projectId: undefined, filterByDueByToday: false },
//      expected: "",
//    },
//  ];
//  test.each(cases)("$name", ({ input, expected }) =>
//    expect(_buildTasksApiQueryString(input)).toBe(expected),
//  );
//});
//
