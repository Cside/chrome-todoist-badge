import { STORAGE_KEY_FOR } from "../storage/storageKeys";
import { activate_tasksCacheRefresh_andBadgeCountUpdates } from "./activate_tasksCacheRefresh_andBadgeCountUpdates";
import { addMessageListeners } from "./addMessageListeners";
import { openWelcomePageOnInstalled } from "./openWelcomePage";
import { setBadgeColor } from "./setBadgeColor";

export const startBackground =
  // async にすると警告が出る
  () => {
    (async () => {
      await Promise.all([
        setBadgeColor(),
        (async () => {
          if ((await storage.getItem(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) !== undefined)
            activate_tasksCacheRefresh_andBadgeCountUpdates();
        })(),
      ]);
    })();
    openWelcomePageOnInstalled();
    addMessageListeners();
  };
