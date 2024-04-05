import ky from "ky";
import { isEmpty } from "lodash-es";
import { MAX_RETRY } from "../constants/httpClient";
import { API_URL_FOR } from "../constants/urls";
import { getTasksFilters } from "../fn/getTasksFilters";
import type { TasksFilters } from "../types";

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
export const getTasksCount = async ({ projectId, filterByDueByToday }: TasksFilters) => {
  const tasks: unknown[] = await kyInstance
    .get(buildTasksApiUrl({ projectId, filterByDueByToday }))
    .json(); // タイムアウト(10秒)はデフォルトのまま
  console.info(tasks);
  return tasks.length;
};

type Project = {
  id: string;
  name: string;
};

export const getProjects = async () => {
  const projects: Project[] = await kyInstance.get(API_URL_FOR.GET_PROJECTS).json();
  return projects;
};

// ==================================================
// for BG worker
// ==================================================
export const getTasksCountWithRetry = async () => {
  return getTasksCountByParamsWithRetry(await getTasksFilters());
};

export const getTasksCountByParamsWithRetry = async ({
  projectId,
  filterByDueByToday,
}: TasksFilters) => {
  const tasks: unknown[] = await kyInstance
    .get(buildTasksApiUrl({ projectId, filterByDueByToday }), {
      // タイムアウトはデフォルト 10 秒
      retry: {
        limit: MAX_RETRY,
      },
    })
    .json();
  console.info(tasks);
  return tasks.length;
};

// ==================================================
// Utils
// ==================================================

const buildTasksApiUrl = (params: TasksFilters) => {
  return `${API_URL_FOR.GET_TASKS}${_buildTasksApiQueryString(params)}`;
};

export const _buildTasksApiQueryString = ({ projectId, filterByDueByToday }: TasksFilters) => {
  const params = {
    ...(projectId !== undefined && { project_id: projectId }),
    ...(filterByDueByToday === true && { filter: ["today", "overdue"].join("|") }),
  };
  return isEmpty(params) ? "" : `?${new URLSearchParams(params)}`;
};
