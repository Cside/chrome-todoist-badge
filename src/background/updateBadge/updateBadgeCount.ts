import { getTasksCountByParamsWithRetry, getTasksCountWithRetry } from "../../api/api";
import type { GetTasksParams } from "../../types";

const setBadgeText = (count: number) =>
  chrome.action.setBadgeText({ text: count === 0 ? "" : String(count) });

// for bg worker
export const updateBadgeCountWithRetry = async ({ via }: { via: string }) => {
  console.info(`(via: ${via}) update badge count`);
  const count = await getTasksCountWithRetry();
  return setBadgeText(count);
};

// for popup
export const updateBadgeCountByParamsWithRetry = async ({
  projectId,
  filterByDueByToday,
  via,
}: GetTasksParams & {
  via: string;
}) => {
  console.info(`(via: ${via}) update badge count`);
  const count = await getTasksCountByParamsWithRetry({ projectId, filterByDueByToday });
  return setBadgeText(count);
};
