let cnt = 0;
export const updateBadgeCount = async () =>
  await chrome.action.setBadgeText({ text: String(++cnt) });
