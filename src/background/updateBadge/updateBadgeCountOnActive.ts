import { updateBadgeCount } from "./updateBadgeCount";

export const updateBadgeCountOnActive = () => {
  chrome.idle.onStateChanged.addListener((idleState) => {
    if (idleState === "active") updateBadgeCount();
  });
};
