import { updateBadgeCount } from "./updateBadgeCount";

const API_URL_MATCH_PATTERN = "https://app.todoist.com/API/v*/sync*";

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      console.log(`${details.method} ${details.url}`);
      updateBadgeCount();
    },
    {
      urls: [API_URL_MATCH_PATTERN],
    },
  );
};
