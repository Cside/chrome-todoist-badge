import { addMessageListeners } from "@/src/background/addMessageListeners";
import { openWelcomePageOnInstalled } from "@/src/background/openWelcomePage";
import { setBadgeColor } from "@/src/background/setBadgeColor";
import { activateBadgeCountUpdates } from "@/src/fn/activateBadgeCountUpdates";
import "@/src/globalUtils";
import { STORAGE_KEY_FOR } from "@/src/storage/queryKeys";

export default defineBackground(
  // async にすると警告が出る
  () => {
    (async () => {
      await Promise.all([
        setBadgeColor(),
        (async () => {
          if ((await storage.getItem(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) !== undefined)
            activateBadgeCountUpdates();
        })(),
      ]);
    })();
    openWelcomePageOnInstalled();
    addMessageListeners();
  },
);
