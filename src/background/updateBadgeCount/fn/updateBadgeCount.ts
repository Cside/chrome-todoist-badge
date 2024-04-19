import { MAX_RETRY } from "@/src/constants/maxRetry";
import { STORAGE_KEY_FOR } from "@/src/storage/queryKeys";
import pRetry from "p-retry";
import * as api from "../../../api/api";
import type { Task } from "../../../api/types";
import { setBadgeText } from "../../../fn/setBadgeText";

// for bg worker
export const updateBadgeCountWithRetry = async ({ via }: { via: string }) => {
  console.info(`(via: ${via}) update badge count`);
  await pRetry(
    async () => {
      const tasks = await api.getTasks();
      await storage.setItem<Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);
      await setBadgeText(tasks.length);
    },
    { retries: MAX_RETRY },
  );
};
