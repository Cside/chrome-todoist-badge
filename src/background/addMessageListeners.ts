import { activateBadgeCountUpdates } from "../fn/activateBadgeCountUpdates";

export const addMessageListeners = () => {
  chrome.runtime.onMessage.addListener((req) => {
    switch (req.action) {
      case "activate-badge-count-updates":
        activateBadgeCountUpdates();
        break;
      default:
        throw new Error(`Unknown action: ${JSON.stringify(req)}`);
    }
  });
};
