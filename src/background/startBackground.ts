import { STORAGE_KEY_FOR } from "../storage/storageKeys";
import { addMessageListeners } from "./tasks/addMessageListeners";
import { openWelcomePageOnInstalled } from "./tasks/openWelcomePage";
import { setBadgeColor } from "./tasks/setBadgeColor";
import { watch_projectsCacheRefresh } from "./tasks/watch_projectsCacheRefresh/watch_projectsCacheRefresh";
import { watch_sectionsCacheRefresh } from "./tasks/watch_sectionsCacheRefresh/watch_sectionsCacheRefresh";
import { watch_tasksCacheRefresh_andBadgeCountUpdates } from "./tasks/watch_tasksCacheRefresh_andBadgeCountUpdates/watch_tasksCacheRefresh_andBadgeCountUpdates";

export const startBackground =
  // async にすると警告が出る
  () => {
    openWelcomePageOnInstalled(); // async の中に入れたら動かないので注意
    addMessageListeners();
    (async () => {
      await setBadgeColor();
      // たかだか chrome.storage の読み込みなので、Promise.all は使わない
      if (
        (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) ===
        true
      )
        await Promise.all([
          watch_tasksCacheRefresh_andBadgeCountUpdates(),
          watch_sectionsCacheRefresh(),
          watch_projectsCacheRefresh(),
        ]);
    })();
  };
