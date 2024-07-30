import pRetry from "p-retry";
import * as api from "../../../../api/tasks/getTasks";
import { MAX_RETRY } from "../../../../constants/maxRetry";
import { setBadgeText } from "../../../../fn/setBadgeText";
import { STORAGE_KEY_FOR } from "../../../../storage/storageKeys";
import type { Task } from "../../../../types";

// for bg worker
export const refreshTasksCache_andUpdateBadgeCount_withRetry = async () => {
  await pRetry(
    async () => {
      const tasks = await api.getTasks();
      await storage.setItem<Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);

      await setBadgeText(tasks.length);
    },
    { retries: MAX_RETRY },
  );
};
