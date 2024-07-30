export const setBadgeText = (count: number) =>
  chrome.action.setBadgeText({ text: count === 0 ? "" : String(count) });
