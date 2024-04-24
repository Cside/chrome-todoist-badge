import { camelCase, mapKeys } from "lodash-es";
import { API_URL_FOR } from "../../constants/urls";
import { getTaskFilters } from "../../storage/taskFilters/getTaskFilters";
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
