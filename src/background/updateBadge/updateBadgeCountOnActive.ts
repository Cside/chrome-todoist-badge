import { updateBadgeCountWithRetry } from "./updateBadgeCountWithRetry";

export const updateBadgeCountOnActive = () => {
  chrome.idle.onStateChanged.addListener(async (idleState) => {
    if (idleState === "active") await updateBadgeCountWithRetry();
  });
};
