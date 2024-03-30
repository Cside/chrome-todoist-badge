import { getTasksCountByParamsWithRetry, getTasksCountWithRetry } from "../../api/api";
import type { TasksFilters } from "../../types";

const setBadgeText = (count: number) =>
  chrome.action.setBadgeText({ text: count === 0 ? "" : String(count) });

// for bg worker
export const updateBadgeCountWithRetry = async ({ via }: { via: string }) => {
  console.info(`(via: ${via}) update badge count`);
  const count = await getTasksCountWithRetry();
  return setBadgeText(count);
};

// for options
export const updateBadgeCountByParamsWithRetry = async ({
  projectId,
  filterByDueByToday,
  via,
}: TasksFilters & {
  via: string;
}) => {
  console.info(`(via: ${via}) update badge count`);
  const count = await getTasksCountByParamsWithRetry({ projectId, filterByDueByToday });
  return setBadgeText(count);
};
