import { updateBadgeCount } from "./updateBadgeCount";

const API_URL_MATCH_PATTERN = "https://app.todoist.com/API/v*/sync*";

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      console.log(`${details.method} ${details.url}`);
      await updateBadgeCount();
    },
    {
      urls: [API_URL_MATCH_PATTERN],
    },
  );
};
