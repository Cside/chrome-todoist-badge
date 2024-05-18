import {
  DEFAULT_FILTER_BY_DUE_BY_TODAY,
  SECTION_ID_FOR,
  SECTION_ID_TO_FILTER,
} from "../../constants/options";
import { API_URL_FOR } from "../../constants/urls";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import type { ProjectId, Task, TaskFilters } from "../../types";
import { ky } from "../ky";
import { getProject } from "../projects/getProject";
import { getSection } from "../sections/getSection";

// for TQ
export const getTasksByParams = async (filters: TaskFilters): Promise<Task[]> => {
  const url = `${API_URL_FOR.GET_TASKS}${await _buildTasksApiQueryString(filters)}`;
  const tasks = await ky.getCamelized<Task[]>(url);
  return tasks;
};

// for BG worker 。Retry は呼び出し元で行うので、ここではやらない
export const getTasks = async (): Promise<Task[]> => {
  const projectId = await storage.getItem<ProjectId>(
    STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
  );
  // 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
  if (projectId === null) throw new Error("projectId is null");

  const filterByDueByToday =
    (await storage.getItem<boolean>(
      STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY,
    )) ?? DEFAULT_FILTER_BY_DUE_BY_TODAY;
  const sectionId =
    (await storage.getItem<ProjectId>(
      STORAGE_KEY_FOR.CONFIG.FILTER_BY.SECTION_ID,
    )) ?? undefined;
  return getTasksByParams({ projectId, filterByDueByToday, sectionId });
};

// ==================================================
// Utils
// ==================================================

// Filter の仕様: https://todoist.com/help/articles/introduction-to-filters-V98wIH
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
  console.info(`[filters] ${filters}`);

  return `?${new URLSearchParams({
    filter: filters,
  })}`;
};

const projectIdToFilter = async (projectId: ProjectId) =>
  // TODO キャッシュ。。
  `#${_escapeFilter((await getProject(projectId)).name)}`;

const sectionIdToFilter = async (sectionId: ProjectId) =>
  sectionId === SECTION_ID_FOR.NO_PARENT
    ? SECTION_ID_TO_FILTER.NO_PARENT
    : // TODO キャッシュ。。
      `/${_escapeFilter((await getSection(sectionId)).name)}`;

export const _escapeFilter = (filter: string) => filter.replace(/([&])/g, "\\$1");
