import { refreshTasksCache_andUpdateBadgeCount_onActive } from "./refreshTasksCache_andUpdateBadgeCount/refreshTasksCache_andUpdateBadgeCount_onActive";
import { refreshTasksCache_andUpdateBadgeCount_onTaskUpdated } from "./refreshTasksCache_andUpdateBadgeCount/refreshTasksCache_andUpdateBadgeCount_onTaskUpdated";
import { refreshTasksCache_andUpdateBadgeCount_regularly } from "./refreshTasksCache_andUpdateBadgeCount/refreshTasksCache_andUpdateBadgeCount_regularly";

export const activate_tasksCacheRefresh_andBadgeCountUpdates = () => {
  refreshTasksCache_andUpdateBadgeCount_regularly();
  refreshTasksCache_andUpdateBadgeCount_onTaskUpdated();
  refreshTasksCache_andUpdateBadgeCount_onActive();
};
