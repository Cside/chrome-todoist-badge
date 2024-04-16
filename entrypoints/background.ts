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
    // FIXME isInitialized 問題をなんとかする
    (async () => {
      await Promise.all([setBadgeColor()]);
    })();
    // FIXME これ、isInitialized が true になってからじゃないとまずくね？
    updateBadgeCountRegularly();
    updateBadgeCountOnTaskUpdated();
    updateBadgeCountOnActive();
    openWelcomePageOnInstalled();
    addMessageListeners();
  },
);
