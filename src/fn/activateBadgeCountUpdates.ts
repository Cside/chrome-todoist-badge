import { updateBadgeCountOnActive } from "../background/updateBadgeCount/updateBadgeCountOnActive";
import { updateBadgeCountOnTaskUpdated } from "../background/updateBadgeCount/updateBadgeCountOnTaskUpdated";
import { updateBadgeCountRegularly } from "../background/updateBadgeCount/updateBadgeCountRegularly";

export const activateBadgeCountUpdates = () => {
  updateBadgeCountRegularly();
  updateBadgeCountOnTaskUpdated();
  updateBadgeCountOnActive();
};
