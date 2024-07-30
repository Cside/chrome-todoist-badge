import { label } from "../../../fn/label";
import { refreshTasksCache_andUpdateBadgeCount_withRetry } from "./fn/refreshTasksCache_andUpdateBadgeCount";
import { refreshTasksCache_andUpdateBadgeCount_onTaskUpdated } from "./refreshTasksCache_andUpdateBadgeCount_onTaskUpdated";
import { refreshTasksCache_andUpdateBadgeCount_regularly } from "./refreshTasksCache_andUpdateBadgeCount_regularly";

export const watch_tasksCacheRefresh_andBadgeCountUpdates = async () => {
  console.info(
    `${label(watch_tasksCacheRefresh_andBadgeCountUpdates.name)} task start`,
  );
  refreshTasksCache_andUpdateBadgeCount_onTaskUpdated();
  await refreshTasksCache_andUpdateBadgeCount_regularly();
  await refreshTasksCache_andUpdateBadgeCount_withRetry();
};
