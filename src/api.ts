import ky from "ky";

export const getCount = async () => {
  return await ky
    .get("https://api.todoist.com/rest/v2/tasks?project_id=660066260")
    .json();
};
