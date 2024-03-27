import { getTasksCountByParamsWithRetry, getTasksCountWithRetry } from "@/src/api/api";

const setBadgeText = (count: number) => chrome.action.setBadgeText({ text: String(count) });

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
}: {
  projectId?: string;
  filterByDueByToday?: boolean;
  via: string;
}) => {
  console.info(`(via: ${via}) update badge count`);
  const count = await getTasksCountByParamsWithRetry({ projectId, filterByDueByToday });
  return setBadgeText(count);
};
