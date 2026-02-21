import { compareVersions } from "compare-versions";
import { HASH_FOR, PATHNAME_FOR } from "../../constants/paths";
import { STORAGE_KEY_FOR } from "../storage/storageKeys";
import { addMessageListeners } from "./tasks/addMessageListeners";
import { openWelcomePageOnInstalled } from "./tasks/openWelcomePage";
import { setBadgeColor } from "./tasks/setBadgeColor";
import { unwatch_projectsCacheRefresh } from "./tasks/watch_projectsCacheRefresh/refreshProjectsCache_onProjectsUpdated";
import { watch_projectsCacheRefresh } from "./tasks/watch_projectsCacheRefresh/watch_projectsCacheRefresh";
import { unwatch_sectionsCacheRefresh } from "./tasks/watch_sectionsCacheRefresh/refreshSectionsCache_onSectionsUpdated";
import { watch_sectionsCacheRefresh } from "./tasks/watch_sectionsCacheRefresh/watch_sectionsCacheRefresh";
import { unwatch_tasksCacheRefresh_andBadgeCountUpdates } from "./tasks/watch_tasksCacheRefresh_andBadgeCountUpdates/refreshTasksCache_andUpdateBadgeCount_onTaskUpdated";
import { watch_tasksCacheRefresh_andBadgeCountUpdates } from "./tasks/watch_tasksCacheRefresh_andBadgeCountUpdates/watch_tasksCacheRefresh_andBadgeCountUpdates";

const DEPRECATED_API_VERSION = "1.1.0";

export const startBackground =
  // async にすると警告が出る
  () => {
    // API v2 のキャッシュは削除する
    chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
      if (
        reason === chrome.runtime.OnInstalledReason.UPDATE &&
        previousVersion !== undefined &&
        compareVersions(previousVersion, DEPRECATED_API_VERSION) <= 0
      ) {
        console.info(
          `API v2 is deprecated. Clearing local storage. version: ${previousVersion}`,
        );
        await chrome.storage.local.clear();
        await chrome.alarms.clearAll();

        unwatch_tasksCacheRefresh_andBadgeCountUpdates();
        unwatch_sectionsCacheRefresh();
        unwatch_projectsCacheRefresh();

        await chrome.tabs.create({
          url: chrome.runtime.getURL(`${PATHNAME_FOR.OPTIONS}${HASH_FOR.WELCOME}`),
          active: true,
        });
      }
    });

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
