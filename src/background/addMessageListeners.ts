import { activate_tasksCacheRefresh_andBadgeCountUpdates } from "./activate_tasksCacheRefresh_andBadgeCountUpdates";

export const addMessageListeners = () => {
  chrome.runtime.onMessage.addListener((req) => {
    switch (req.action) {
      case "activate-tasks-cache-refresh-and-badge-count-updates":
        activate_tasksCacheRefresh_andBadgeCountUpdates();
        break;
      default:
        throw new Error(`Unknown action: ${JSON.stringify(req)}`);
    }
  });
};
