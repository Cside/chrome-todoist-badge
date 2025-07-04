import { label } from "../../../fn/label";
import { refreshTasksCache_andUpdateBadgeCount_onTaskUpdated } from "./refreshTasksCache_andUpdateBadgeCount_onTaskUpdated";
import { refreshTasksCache_andUpdateBadgeCount_regularly } from "./refreshTasksCache_andUpdateBadgeCount_regularly";

export const watch_tasksCacheRefresh_andBadgeCountUpdates = async () => {
  console.info(
    `${label("watch-tasks-cache-refresh-and-badge-count-updates")} task start`,
  );
  refreshTasksCache_andUpdateBadgeCount_onTaskUpdated();
  await refreshTasksCache_andUpdateBadgeCount_regularly();
};
