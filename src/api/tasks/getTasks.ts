import { HTTPError } from "ky";
import {
  DEFAULT_FILTER_BY_DUE_BY_TODAY,
  SECTION_ID_FOR_STORAGE,
  SECTION_ID_TO_FILTER,
} from "../../constants/options";
import { STATUS_CODE_FOR } from "../../constants/statusCodes";
import { API_PATH_FOR, API_REST_BASE_URL } from "../../constants/urls";
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

export const getTasksForWorker = async () => {
  try {
    return await getTasks();
  } catch (error) {
    if (isBadRequestErrorForTaskFetch(error)) await cleanupStorage(error);
    throw error;
  }
};

export const isBadRequestErrorForTaskFetch = (error: unknown): error is HTTPError =>
  error instanceof HTTPError &&
  error.response.status === STATUS_CODE_FOR.BAD_REQUEST &&
  error.request.url.replace(/\?.*$/, "") ===
    `${API_REST_BASE_URL}${API_PATH_FOR.GET_TASKS}`;

// Bad Request かどうかの検証は済んでいるものとする。
// 1. Bad Request の場合、ストレージをクリアする
// 2. エラーの情報をもう少し増やす
export const cleanupStorage = async (error: HTTPError) => {
  if (error.response.bodyUsed) {
    console.error("bodyUsed is already true");
    throw error;
  }

  // NOTE: 他にも Error の body を読むところが出てきたら、共通化する
  const responseText = await error.response.text();
  if (responseText !== "The search query is incorrect") {
    console.error(
      `Error message is not "The search query is incorrect". Message: ${responseText}`,
    );
    return;
  }

  await chrome.storage.local.clear();
  // Bad Request の場合、ストレージをクリアする
  console.error(
    `Bad request. storage was cleared. url: ${error.response.url}, error: ${error}`,
  );
};

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

export const _escapeFilter = (filter: string) => filter.replace(/([&])/g, "\\$1");
