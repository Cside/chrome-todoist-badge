import * as api from "./fn/refreshTasksCache_andUpdateBadgeCount";

export const refreshTasksCache_andUpdateBadgeCount_onActive = () => {
  chrome.idle.onStateChanged.addListener(async (idleState) => {
    if (idleState === "active")
      await api.refreshTasksCache_andUpdateBadgeCount_withRetry({ via: "on active" });
  });
};
