import { API_URL_MATCH_PATTERN_FOR } from "@/src/constants/urls";
import * as api from "./fn/updateBadgeCount";

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      console.info(`${details.method} ${details.url}`);
      await api.updateBadgeCountWithRetry({ via: "on task updated on Todoist Web App" });
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
  );
};
