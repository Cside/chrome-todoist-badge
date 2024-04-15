import { addMessageListeners } from "@/src/background/addMessageListeners";
import { openWelcomePageOnInstalled } from "@/src/background/openWelcomePage";
import { setBadgeColor } from "@/src/background/setBadgeColor";
import { updateBadgeCountOnActive } from "@/src/background/updateBadge/updateBadgeCountOnActive";
import { updateBadgeCountOnTaskUpdated } from "@/src/background/updateBadge/updateBadgeCountOnTaskUpdated";
import { updateBadgeCountRegularly } from "@/src/background/updateBadge/updateBadgeCountRegularly";
import "@/src/globalUtils";

export default defineBackground(
  // async にすると警告が出る
  () => {
    (async () => {
      await Promise.all([setBadgeColor()]);
    })();
    updateBadgeCountRegularly();
    updateBadgeCountOnTaskUpdated();
    updateBadgeCountOnActive();
    openWelcomePageOnInstalled();
    addMessageListeners();
  },
);
