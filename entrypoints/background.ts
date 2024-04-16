import { addMessageListeners } from "@/src/background/addMessageListeners";
import { openWelcomePageOnInstalled } from "@/src/background/openWelcomePage";
import { setBadgeColor } from "@/src/background/setBadgeColor";
import { STORAGE_KEY_FOR } from "@/src/constants/storageKeys";
import { activateBadgeCountUpdates } from "@/src/fn/activateBadgeCountUpdates";
import "@/src/globalUtils";

export default defineBackground(
  // async にすると警告が出る
  () => {
    (async () => {
      await Promise.all([
        setBadgeColor(),
        (async () => {
          if (await storage.getItem(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED))
            activateBadgeCountUpdates();
        })(),
      ]);
    })();
    openWelcomePageOnInstalled();
    addMessageListeners();
  },
);
