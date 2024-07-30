import { watch_sectionsCacheRefresh } from "./watch_sectionsCacheRefresh/watch_sectionsCacheRefresh";
import { watch_tasksCacheRefresh_andBadgeCountUpdates } from "./watch_tasksCacheRefresh_andBadgeCountUpdates/watch_tasksCacheRefresh_andBadgeCountUpdates";

export const addMessageListeners = () => {
  chrome.runtime.onMessage.addListener(async (message) => {
    switch (message.action) {
      case "watch-tasks-cache-refresh-and-badge-count-updates":
        await watch_tasksCacheRefresh_andBadgeCountUpdates();
        break;
      case "watch-sections-cache-refresh":
        await watch_sectionsCacheRefresh();
        break;
      default:
        throw new Error(`Unknown action: ${JSON.stringify(message)}`);
    }
  });
};
