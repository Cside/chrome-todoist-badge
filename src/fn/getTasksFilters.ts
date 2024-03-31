import { storage } from "wxt/storage";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import { STORAGE_KEY_OF } from "../constants/storageKeys";
import type { TasksFilters } from "../types";

// TODO 場所がイマイチ…
export const getTasksFilters = async (): Promise<TasksFilters> => {
  const projectId =
    (await storage.getItem<string>(STORAGE_KEY_OF.CONFIG.FILTER_BY.PROJECT_ID)) ?? undefined;

  const filterByDueByToday =
    (await storage.getItem<boolean>(STORAGE_KEY_OF.CONFIG.FILTER_BY.DUE_BY_TODAY)) ??
    DEFAULT_FILTER_BY_DUE_BY_TODAY;

  return { projectId, filterByDueByToday };
};
