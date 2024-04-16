import { activateBadgeCountUpdates } from "../fn/activateBadgeCountUpdates";
import { openOptionsPage } from "./onMessage/openOptionsPage";

export const addMessageListeners = () => {
  chrome.runtime.onMessage.addListener(async (req) => {
    switch (req.action) {
      case "open-options-page":
        await openOptionsPage();
        break;
      case "activate-badge-count-updates":
        activateBadgeCountUpdates();
        break;
      default:
        throw new Error(`Unknown action: ${JSON.stringify(req)}`);
    }
  });
};
