import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "@/src/constants/options";
import { STORAGE_KEY_FOR } from "@/src/storage/storageKeys";
import { camelCase, mapKeys } from "lodash-es";
import { API_URL_FOR } from "../../constants/urls";
import type { TaskFilters } from "../../types";
import { kyInstance } from "../kyInstance";
import type { Task } from "../types";

// for TQ
export const getTasksByParams = async (filters: TaskFilters): Promise<Task[]> => {
  // biome-ignore lint/suspicious/noExplicitAny:
  const res: any[] = await kyInstance
    .get(buildTasksApiUrl(filters)) // タイムアウトはデフォルト 10 秒
    .json();
  return res.map((task) => mapKeys(task, (_value, key) => camelCase(key)) as Task);
};

// for BG worker
export const getTasks = async (): Promise<Task[]> => getTasksByParams(await getTaskFilters());

// 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
const getTaskFilters = async (): Promise<TaskFilters> => {
  const projectId = await storage.getItem<string>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID);
  if (projectId === null) throw new Error("projectId is null");

  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY)) ??
    DEFAULT_FILTER_BY_DUE_BY_TODAY;
  const sectionId =
    (await storage.getItem<string>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.SECTION_ID)) ?? undefined;

  return { projectId, filterByDueByToday, sectionId };
};

// ==================================================
// Utils
// ==================================================
const buildTasksApiUrl = (params: TaskFilters) =>
  `${API_URL_FOR.GET_TASKS}${_buildTasksApiQueryString(params)}`;

export const _buildTasksApiQueryString = ({
  projectId,
  filterByDueByToday,
  sectionId,
}: TaskFilters) =>
  `?${new URLSearchParams({
    project_id: projectId,
    ...(filterByDueByToday === true && { filter: ["today", "overdue"].join("|") }),
    ...(sectionId !== undefined && { section_id: sectionId }),
  })}`;
