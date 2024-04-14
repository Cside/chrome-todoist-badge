import * as api from "../../../api/api";
import { setBadgeText } from "../../../fn/setBadgeText";

// for bg worker
export const updateBadgeCountWithRetry = async ({ via }: { via: string }) => {
  console.info(`(via: ${via}) update badge count`);
  const tasks = await api.getTasksWithRetry();
  return setBadgeText(tasks.length);
};
