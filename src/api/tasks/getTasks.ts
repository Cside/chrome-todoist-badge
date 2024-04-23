import { camelCase, isEmpty, mapKeys } from "lodash-es";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../../constants/options";
import { API_URL_FOR } from "../../constants/urls";
import { STORAGE_KEY_FOR } from "../../storage/queryKeys";
import type { TaskFilters } from "../../types";
import { kyInstance } from "../kyInstance";
import type { Project, Task } from "../types";

// ==================================================
// for Web Page ( TQ で呼ぶの前提)
// ==================================================

export const getTasksByParams = async ({
  projectId,
  filterByDueByToday,
}: TaskFilters): Promise<Task[]> => {
  // biome-ignore lint/suspicious/noExplicitAny:
  const res: any[] = await kyInstance
    .get(buildTasksApiUrl({ projectId, filterByDueByToday })) // タイムアウトはデフォルト 10 秒
    .json();
  return res.map((task) => mapKeys(task, (_value, key) => camelCase(key)) as Task);
};

export const getProjects = async () => {
  const projects: Project[] = await kyInstance.get(API_URL_FOR.GET_PROJECTS).json();
  return projects;
};
// ==================================================
// for BG worker
// ==================================================

export const getTasks = async (): Promise<Task[]> => getTasksByParams(await getTasksFilters());
// ==================================================
// Utils
// ==================================================
const buildTasksApiUrl = (params: TaskFilters) => {
  return `${API_URL_FOR.GET_TASKS}${_buildTasksApiQueryString(params)}`;
};

export const _buildTasksApiQueryString = ({ projectId, filterByDueByToday }: TaskFilters) => {
  const params = {
    project_id: projectId,
    ...(filterByDueByToday === true && { filter: ["today", "overdue"].join("|") }),
  };
  return isEmpty(params) ? "" : `?${new URLSearchParams(params)}`;
};
// 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
const getTasksFilters = async (): Promise<TaskFilters> => {
  const projectId = await storage.getItem<string>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID);
  if (projectId === null) throw new Error("projectId is null");

  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY)) ??
    DEFAULT_FILTER_BY_DUE_BY_TODAY;

  return { projectId, filterByDueByToday };
};
