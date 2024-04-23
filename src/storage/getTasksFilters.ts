import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import type { TaskFilters } from "../types";
import { STORAGE_KEY_FOR } from "./storageKeys";

// 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
export const getTasksFilters = async (): Promise<TaskFilters> => {
  const projectId = await storage.getItem<string>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID);
  if (projectId === null) throw new Error("projectId is null");

  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY)) ??
    DEFAULT_FILTER_BY_DUE_BY_TODAY;
  const sectionId =
    (await storage.getItem<string>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.SECTION_ID)) ?? undefined;

  return { projectId, filterByDueByToday, sectionId };
};
