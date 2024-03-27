import ky from "ky";
import { isEmpty } from "lodash-es";
import { STORAGE_KEY_OF } from "../constants/storageKeys";
import { API_BASE_URL } from "../constants/urls";

const MAX_RETRY = 3;
const BASE_URL = `${API_BASE_URL}/rest/v2`;

// ==================================================
// for Popup ( TQ で呼ぶの前提)
// ==================================================
export const getTasksCount = async ({
  projectId,
  filterByDueByToday,
}: {
  projectId?: string;
  filterByDueByToday?: boolean;
}) => {
  const tasks: unknown[] = await ky.get(buildTasksApiUrl({ projectId, filterByDueByToday })).json(); // タイムアウト(10秒)はデフォルトのまま
  console.log(tasks);
  return tasks.length;
};

type Project = {
  id: string;
  name: string;
};

export const getProjects = async () => {
  const projects: Project[] = await ky.get(`${BASE_URL}/projects`).json();
  return projects;
};

// ==================================================
// for BG worker
// ==================================================
export const getTasksCountWithRetry = async () => {
  const projectId =
    (await storage.getItem<string>(STORAGE_KEY_OF.FILTERING_PROJECT_ID)) ?? undefined;
  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_OF.FILTER_DUE_BY_TODAY)) ?? undefined;

  return getTasksCountByParamsWithRetry({ projectId, filterByDueByToday });
};

export const getTasksCountByParamsWithRetry = async ({
  projectId,
  filterByDueByToday,
}: {
  projectId?: string;
  filterByDueByToday?: boolean;
}) => {
  const tasks: unknown[] = await ky
    .get(buildTasksApiUrl({ projectId, filterByDueByToday }), {
      // タイムアウトはデフォルト 10 秒
      retry: {
        limit: MAX_RETRY,
      },
    })
    .json();
  console.log(tasks);
  return tasks.length;
};

// ==================================================
// Utils
// ==================================================

const buildTasksApiUrl = ({
  projectId,
  filterByDueByToday,
}: {
  projectId?: string;
  filterByDueByToday?: boolean;
}) => {
  let url = `${BASE_URL}/tasks`;
  const params = {
    ...(projectId !== undefined && { project_id: projectId }),
    ...(filterByDueByToday === true && { filter: ["today", "overdue"].join("|") }),
  };
  if (!isEmpty(params)) url += `?${new URLSearchParams(params)}`;
  return url;
};
