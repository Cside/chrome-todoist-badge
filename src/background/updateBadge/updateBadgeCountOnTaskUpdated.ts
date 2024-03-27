import { SYNC_API_URL_MATCH_PATTERN } from "@/src/constants/urls";
import { updateBadgeCountWithRetry } from "./updateBadgeCount";

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      console.log(`${details.method} ${details.url}`);
      await updateBadgeCountWithRetry({ via: "on task updated on Todoist Web App" });
    },
    {
      urls: [SYNC_API_URL_MATCH_PATTERN],
    },
  );
};
