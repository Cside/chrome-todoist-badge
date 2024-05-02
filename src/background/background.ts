import { STORAGE_KEY_FOR } from "../storage/storageKeys";
import { activate_tasksCacheRefresh_andBadgeCountUpdates } from "./tasks/activate_tasksCacheRefresh_andBadgeCountUpdates/activate_tasksCacheRefresh_andBadgeCountUpdates";
import { addMessageListeners } from "./tasks/addMessageListeners";
import { openWelcomePageOnInstalled } from "./tasks/openWelcomePage";
import { setBadgeColor } from "./tasks/setBadgeColor";

export const startBackground =
  // async にすると警告が出る
  () => {
    (async () => {
      await setBadgeColor();
      // たかだか chrome.storage の読み込みなので、Promise.all は使わない
      if ((await storage.getItem<number>(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) !== null)
        activate_tasksCacheRefresh_andBadgeCountUpdates();

      openWelcomePageOnInstalled();
      addMessageListeners();
    })();
  };
