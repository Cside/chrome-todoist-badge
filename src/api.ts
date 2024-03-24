import ky from "ky";
import { API_BASE_URL } from "./constants/urls";

const MAX_RETRY = 3;

export const getTasksCountWithRetry = async () => {
  const tasks: unknown[] = await ky
    .get(`${API_BASE_URL}/rest/v2/tasks?project_id=660066260`, {
      retry: {
        limit: MAX_RETRY,
      },
    })
    .json();
  console.log(tasks);
  return tasks.length;
};
