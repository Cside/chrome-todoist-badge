import * as api from "../../api/api";

export const setBadgeText = (count: number) =>
  chrome.action.setBadgeText({ text: count === 0 ? "" : String(count) });

// for bg worker
export const updateBadgeCountWithRetry = async ({ via }: { via: string }) => {
  console.info(`(via: ${via}) update badge count`);
  const tasks = await api.getTasksWithRetry();
  return setBadgeText(tasks.length);
};
