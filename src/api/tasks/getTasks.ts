import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../../constants/options";
import { API_REST_BASE_URL, API_URL_FOR } from "../../constants/urls";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import type { ProjectId, Section, Task, TaskFilters } from "../../types";
import { ky } from "../ky";

// for TQ
export const getTasksByParams = async (filters: TaskFilters): Promise<Task[]> => {
  const url = `${API_URL_FOR.GET_TASKS}${await _buildTasksApiQueryString(filters)}`;
  const tasks = await ky.getCamelized<Task[]>(url);
  return tasks;
};

// for BG worker 。Retry は呼び出し元で行うので、ここではやらない
export const getTasks = async (): Promise<Task[]> => getTasksByParams(await getTaskFilters());

// 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
const getTaskFilters = async (): Promise<TaskFilters> => {
  const projectId = await storage.getItem<ProjectId>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID);
  if (projectId === null) throw new Error("projectId is null");

  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY)) ??
    DEFAULT_FILTER_BY_DUE_BY_TODAY;
  const sectionId =
    (await storage.getItem<ProjectId>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.SECTION_ID)) ?? undefined;

  return { projectId, filterByDueByToday, sectionId };
};

// ==================================================
// Utils
// ==================================================

// Spec: https://todoist.com/help/articles/introduction-to-filters-V98wIH
export const _buildTasksApiQueryString = async ({
  projectId,
  filterByDueByToday,
  sectionId,
}: TaskFilters) => {
  const filters = [
    filterByDueByToday === true && "(today | overdue)",
    ...(await Promise.all([
      await projectIdToFilter(projectId),
      sectionId !== undefined && (await sectionIdToFilter(sectionId)),
    ])),
  ]
    .filter(Boolean)
    .join(" & ");

  return `?${new URLSearchParams({
    filter: filters,
  })}`;
};

import * as self from "./getTasks";

const projectIdToFilter = async (projectId: ProjectId) =>
  `#${_escapeFilter(await self._projectIdToName(projectId))}`;

const sectionIdToFilter = async (sectionId: ProjectId) =>
  `/${_escapeFilter(await self._sectionIdToName(sectionId))}`;

// FIXME: 404 とかの場合のハンドリング
// TODO: キャッシュ…どうしようね…
export const _sectionIdToName = async (sectionId: ProjectId) =>
  (await ky.getCamelized<Section>(`${API_REST_BASE_URL}/sections/${sectionId}`)).name;

export const _projectIdToName = async (projectId: ProjectId) =>
  (await ky.getCamelized<Section>(`${API_REST_BASE_URL}/projects/${projectId}`)).name;

export const _escapeFilter = (filter: string) => filter.replace(/([&])/g, "\\$1");
