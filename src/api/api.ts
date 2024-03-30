import ky from "ky";
import { isEmpty } from "lodash-es";
import { MAX_RETRY } from "../constants/httpClient";
import {
  DEFAULT_FILTER_BY_DUE_BY_TODAY,
  DEFAULT_PROJECT_ID,
  PROJECT_ID_ALL,
} from "../constants/options";
import { STORAGE_KEY_OF } from "../constants/storageKeys";
import { API_BASE_URL } from "../constants/urls";
import type { GetTasksParams } from "../types";

const BASE_URL = `${API_BASE_URL}/rest/v2`;

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
// for Popup ( TQ で呼ぶの前提)
// ==================================================
export const getTasksCount = async ({ projectId, filterByDueByToday }: GetTasksParams) => {
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
  const projects: Project[] = await kyInstance.get(`${BASE_URL}/projects`).json();
  return projects;
};

// ==================================================
// for BG worker
// ==================================================
export const getTasksCountWithRetry = async () => {
  const projectId =
    (await storage.getItem<string>(STORAGE_KEY_OF.FILTER_BY.PROJECT_ID)) ?? DEFAULT_PROJECT_ID;
  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_OF.FILTER_BY.DUE_BY_TODAY)) ??
    DEFAULT_FILTER_BY_DUE_BY_TODAY;

  return getTasksCountByParamsWithRetry({ projectId, filterByDueByToday });
};

export const getTasksCountByParamsWithRetry = async ({
  projectId,
  filterByDueByToday,
}: GetTasksParams) => {
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

const buildTasksApiUrl = ({
  projectId,
  filterByDueByToday,
}: {
  projectId: string;
  filterByDueByToday: boolean;
}) => {
  let url = `${BASE_URL}/tasks`;
  const params = {
    ...(projectId !== PROJECT_ID_ALL && { project_id: projectId + "11" }),
    ...(filterByDueByToday === true && { filter: ["today", "overdue"].join("|") }),
  };
  if (!isEmpty(params)) url += `?${new URLSearchParams(params)}`;
  return url;
};
