import { setBadgeColor } from "@/src/background/setBadgeColor";
import { updateBadgeCountOnActive } from "@/src/background/updateBadge/updateBadgeCountOnActive";
import { updateBadgeCountOnTaskUpdated } from "@/src/background/updateBadge/updateBadgeCountOnTaskUpdated";
import { updateBadgeCountRegularly } from "@/src/background/updateBadge/updateBadgeCountRegularly";

export default defineBackground(
  // async にすると警告が出る
  () => {
    Promise.all([setBadgeColor()]);
    updateBadgeCountRegularly();
    updateBadgeCountOnTaskUpdated();
    updateBadgeCountOnActive();

    chrome.action.onClicked.addListener(async () => await chrome.runtime.openOptionsPage());
    chrome.runtime.onInstalled.addListener(async ({ reason }) => {
      if (reason === chrome.runtime.OnInstalledReason.INSTALL)
        await chrome.tabs.create({
          url: chrome.runtime.getURL("/welcome.html"),
          active: true,
        });
    });
  },
);
