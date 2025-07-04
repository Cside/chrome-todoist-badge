import * as api from "../../../../api/tasks/getTasks";
import { setBadgeText } from "../../../../fn/setBadgeText";
import { STORAGE_KEY_FOR } from "../../../../storage/storageKeys";
import type { Api } from "../../../../types";

// for bg worker
export const refreshTasksCache_andUpdateBadgeCount = async () => {
  const tasks = await api.getTasksForWorker();
  // storage は実質失敗し得ないので、リトライはしない
  await storage.setItem<Api.Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);

  await setBadgeText(tasks.length);
};
