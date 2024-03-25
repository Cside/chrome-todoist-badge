import ky from "ky";
import { API_BASE_URL } from "../constants/urls";

const MAX_RETRY = 3;

// ========================================
// for BG worker
// ========================================
export const getTasksCountWithRetry = async () => {
  // FIXME: 条件を取得
  const tasks: unknown[] = await ky
    .get(`${API_BASE_URL}/rest/v2/tasks?project_id=660066260`, {
      // タイムアウトはデフォルト 10 秒
      retry: {
        limit: MAX_RETRY,
      },
    })
    .json();
  console.log(tasks);
  return tasks.length;
};

// ========================================
// for Popup ( TQ で呼ぶの前提)
// ========================================
export const getTasksCount = async ({ projectId }: { projectId: string }) => {};

type Project = {
  id: string;
  name: string;
};

export const getProjects = async () => {
  const projects: Project[] = await ky.get(`${API_BASE_URL}/rest/v2/projects`).json();
  return projects;
};
