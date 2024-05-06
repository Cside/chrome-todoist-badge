import { activate_sectionsCacheRefresh } from "./activate_sectionsCacheRefresh/activate_sectionsCacheRefresh";
import { activate_tasksCacheRefresh_andBadgeCountUpdates } from "./activate_tasksCacheRefresh_andBadgeCountUpdates/activate_tasksCacheRefresh_andBadgeCountUpdates";

export const addMessageListeners = () => {
  chrome.runtime.onMessage.addListener(async (req) => {
    switch (req.action) {
      case "activate-tasks-cache-refresh-and-badge-count-updates":
        await activate_tasksCacheRefresh_andBadgeCountUpdates();
        break;
      case "activate-sections-cache-refresh":
        await activate_sectionsCacheRefresh();
        break;
      default:
        throw new Error(`Unknown action: ${JSON.stringify(req)}`);
    }
  });
};
