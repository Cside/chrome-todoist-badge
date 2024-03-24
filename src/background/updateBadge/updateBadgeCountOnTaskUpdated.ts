import { SYNC_API_URL_MATCH_PATTERN } from "@/src/constants/urls";
import { updateBadgeCount } from "./updateBadgeCount";

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      console.log(`${details.method} ${details.url}`);
      await updateBadgeCount();
    },
    {
      urls: [SYNC_API_URL_MATCH_PATTERN],
    },
  );
};
