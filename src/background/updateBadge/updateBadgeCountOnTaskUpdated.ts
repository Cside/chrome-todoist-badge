import { API_URL_MATCH_PATTERN_FOR } from "@/src/constants/urls";
import { updateBadgeCountWithRetry } from "./updateBadgeCount";

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      console.info(`${details.method} ${details.url}`);
      await updateBadgeCountWithRetry({ via: "on task updated on Todoist Web App" });
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
  );
};
