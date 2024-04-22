import ky from "ky";
import { camelCase, isEmpty, mapKeys } from "lodash-es";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import { API_URL_FOR } from "../constants/urls";
import { STORAGE_KEY_FOR } from "../storage/queryKeys";
import type { TaskFilters } from "../types";
import type { Project, Task } from "./types";

// これだとリクエストがパラで飛んだ時駄目。
// req id があれば一番楽だが...
const requestStartedAt: Map<string, number | undefined> = new Map();
const kyInstance = ky.create({
  hooks: {
    beforeRequest: [
      (req) => {
        requestStartedAt.set(req.url, Date.now());
      },
    ],
    afterResponse: [
      (req, _options, res) => {
        const startedAt = requestStartedAt.get(req.url);
        if (startedAt === undefined) {
          console.warn(`startedAt (url: ${req.url}) is undefined`);
          return;
        }
        const elapsed = `${((Date.now() - startedAt) / 1_000).toFixed(2)}ms`;
        console.info(`(${elapsed}) ${res.status} ${req.method} ${req.url}`);
      },
    ],
  },
});

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
  const tasks = res.map((task) => mapKeys(task, (_value, key) => camelCase(key)) as Task);
  console.info(tasks);
  return tasks;
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

const getTasksFilters = async (): Promise<TaskFilters> => {
  const projectId = await storage.getItem<string>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID);
  if (projectId === null) throw new Error("projectId is undefined");

  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY)) ??
    DEFAULT_FILTER_BY_DUE_BY_TODAY;

  return { projectId, filterByDueByToday };
};
