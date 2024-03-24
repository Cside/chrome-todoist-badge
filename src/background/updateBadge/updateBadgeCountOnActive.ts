import { updateBadgeCount } from "./updateBadgeCount";

export const updateBadgeCountOnActive = () => {
  chrome.idle.onStateChanged.addListener(async (idleState) => {
    if (idleState === "active") await updateBadgeCount();
  });
};
