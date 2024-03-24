import { getTasksCountWithRetry } from "@/src/api/api";

// TODO: retry どうするよ。特に active 復帰時とか通信状況めためたじゃね？
export const updateBadgeCount = async () =>
  chrome.action.setBadgeText({ text: String(await getTasksCountWithRetry()) });
