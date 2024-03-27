import { getTasksCountByParamsWithRetry, getTasksCountWithRetry } from "@/src/api/api";

// for bg worker
export const updateBadgeCountWithRetry = async () => {
  const count = await getTasksCountWithRetry();
  return chrome.action.setBadgeText({ text: String(count) });
};

// for popup
export const updateBadgeCountByParamsWithRetry = async ({
  projectId,
  filterByDueByToday,
}: {
  projectId?: string;
  filterByDueByToday?: boolean;
}) => {
  const count = await getTasksCountByParamsWithRetry({ projectId, filterByDueByToday });
  return chrome.action.setBadgeText({ text: String(count) });
};
