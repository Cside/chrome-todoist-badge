import { refreshTasksCache_andUpdateBadgeCount_onTaskUpdated } from "./refreshTasksCache_andUpdateBadgeCount_onTaskUpdated";
import { refreshTasksCache_andUpdateBadgeCount_regularly } from "./refreshTasksCache_andUpdateBadgeCount_regularly";

export const activate_tasksCacheRefresh_andBadgeCountUpdates = async () => {
  console.info(`[task start] ${activate_tasksCacheRefresh_andBadgeCountUpdates.name}`);
  refreshTasksCache_andUpdateBadgeCount_onTaskUpdated();
  await refreshTasksCache_andUpdateBadgeCount_regularly();
};
