import {
  DEFAULT_FILTER_BY_DUE_BY_TODAY,
  SECTION_ID_FOR_STORAGE,
  SECTION_ID_TO_FILTER,
} from "../../constants/options";
import { API_PATH_FOR } from "../../constants/urls";
import { ProjectIdNotFoundError } from "../../errors";
import { clearStorage, shouldClearStorage } from "../../fn/clearStorage";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import type { ProjectId, Task, TaskFilters } from "../../types";
import { ky } from "../ky";
import { getProject } from "../projects/getProject";
import { getSection } from "../sections/getSection";

// for TQ
export const getTasksByParams = async (filters: TaskFilters): Promise<Task[]> => {
  const url = `${API_PATH_FOR.GET_TASKS}${await _buildTasksApiQueryString(filters)}`;
  return await ky.fetchAndNormalize<Task[]>(url);
};

// for BG worker 。Retry は呼び出し元で行うので、ここではやらない
const getTasks = async (): Promise<Task[]> => {
  const projectId = await storage.getItem<ProjectId>(
    STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
  );
  // 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
  if (projectId === null) throw new ProjectIdNotFoundError("projectId is null");

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

export const getTasksForWorker = async () => {
  try {
    return await getTasks();
  } catch (error) {
    if (shouldClearStorage(error)) await clearStorage(error);
    throw error;
  }
};

// Bad Request かどうかの検証は済んでいるものとする。
// 1. Bad Request の場合、ストレージをクリアする
// 2. エラーの情報をもう少し増やす
// ==================================================
// Utils
// ==================================================

// Filter の仕様: https://todoist.com/help/articles/introduction-to-filters-V98wIH
/* NOTE: section_id, project_id クエリパラメータを使わない理由：
  - filter: (today|overdue) と併用できないから
*/
export const _buildTasksApiQueryString = async ({
  projectId,
  filterByDueByToday,
  sectionId,
}: TaskFilters) => {
  const filters = [
    filterByDueByToday === true && "(today | overdue)",
    ...(await Promise.all([
      projectIdToFilter(projectId),
      sectionId !== undefined && sectionIdToFilter(sectionId),
    ])),
  ]
    .filter(Boolean)
    .join(" & ");

  return `?${new URLSearchParams({ filter: filters })}`;
};

const projectIdToFilter = async (projectId: ProjectId) =>
  // TODO キャッシュ。。
  `#${_escapeFilter((await getProject(projectId)).name)}`;

const sectionIdToFilter = async (sectionId: ProjectId) =>
  sectionId === SECTION_ID_FOR_STORAGE.NO_PARENT
    ? SECTION_ID_TO_FILTER.NO_PARENT
    : // TODO キャッシュ。。
      `/${_escapeFilter((await getSection(sectionId)).name)}`;

// https://www.notion.so/18ccb33a6a1f8095bef8e41a751d8200?pvs=4#18ccb33a6a1f8031987dfe3964752b7c
// 絵文字・空白・スラッシュ等は、今のところ、エスケープしなくても怒られない
// 公式のサンプルでは空白をエスケープしているので、そこが少し心配⋯
export const _escapeFilter = (filter: string) =>
  filter.replace(/([&,#\(\)])/g, "\\$1");
