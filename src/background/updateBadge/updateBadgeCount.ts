import { getTasksCount } from "@/src/api";

export const updateBadgeCount = async () =>
  chrome.action.setBadgeText({ text: String(await getTasksCount()) });
