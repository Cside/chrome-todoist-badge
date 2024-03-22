import { start as setBadgeColor } from "@/src/background/setBadgeColor";
import { start as updateCount } from "@/src/background/updateCount";

export default defineBackground(
  // async にすると警告が出る
  () => {
    Promise.all([setBadgeColor()]);
    updateCount();
  },
);
