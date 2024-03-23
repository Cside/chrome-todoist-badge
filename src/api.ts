import ky from "ky";

export const getTasksCount = async () => {
  const tasks: unknown[] = await ky
    .get("https://api.todoist.com/rest/v2/tasks?project_id=660066260")
    .json();
  console.log(tasks);
  return tasks.length;
};
