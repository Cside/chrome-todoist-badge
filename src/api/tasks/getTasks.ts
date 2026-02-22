import {
  DEFAULT_FILTER_BY_DUE_BY_TODAY,
  SECTION_ID_FOR_STORAGE,
  SECTION_ID_TO_FILTER,
} from "../../constants/options";
import { API_PATH_FOR } from "../../constants/urls";
import { clearStorage, shouldClearStorage } from "../../fn/clearStorage";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import type { Api, ProjectId, TaskFilters } from "../../types";
import { ky } from "../ky";
import { getProject } from "../projects/getProject";
import { getSection } from "../sections/getSection";

/*
  (Worker)--> getTasksForWorker
               └getTasks
  (Web)--> useTasks │
            └───┤
                    └getTasksByPrams
                       └_buildTasksApiQueryString
*/

// for TQ
export const getTasksByParams = async (
  filters: TaskFilters,
): Promise<Api.Task[]> => {
  // ベースとなるURLとクエリ文字列を一度だけ生成します
  const [hasFilter, filter] = await _buildFilter(filters);

  const tasks: Api.Task[] = [];
  let nextCursor: string | null = null;

  do {
    type ReturnedType = {
      results: Api.Task[];
      nextCursor: string | null;
    };
    const result: ReturnedType = await ky.fetchAndNormalize<ReturnedType>(
      `${hasFilter ? API_PATH_FOR.GET_TASKS_WITH_FILTER : API_PATH_FOR.GET_TASKS}?${new URLSearchParams(
        {
          ...(hasFilter && { query: filter }),
          ...(typeof nextCursor === "string" && { cursor: nextCursor }),
        },
      )}`,
    );

    tasks.push(...result.results);

    nextCursor = result.nextCursor;
  } while (typeof nextCursor === "string"); // cursorがnullになるまで繰り返す

  return tasks;
};

const getTasks = async (): Promise<Api.Task[]> => {
  const projectId =
    (await storage.getItem<ProjectId>(
      STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
    )) ?? undefined;

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

// for BG worker 。Retry は呼び出し元で行うので、ここではやらない
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
export const _buildFilter = async ({
  projectId,
  filterByDueByToday,
  sectionId,
}: TaskFilters): Promise<[false, undefined] | [true, string]> => {
  const filter = [
    filterByDueByToday === true && "(today | overdue)",
    ...(await Promise.all([
      projectId !== undefined && projectIdToFilter(projectId),
      sectionId !== undefined && sectionIdToFilter(sectionId),
    ])),
  ]
    .filter(Boolean)
    .join(" & ");

  return filter === "" ? [false, undefined] : [true, filter];
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
