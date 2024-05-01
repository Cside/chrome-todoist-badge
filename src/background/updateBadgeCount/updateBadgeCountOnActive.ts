import * as api from "./fn/updateBadgeCount";

export const updateBadgeCountOnActive = () => {
  chrome.idle.onStateChanged.addListener(async (idleState) => {
    if (idleState === "active")
      await api.updateBadgeCount_AndResetCache_WithRetry({ via: "on active" });
  });
};
