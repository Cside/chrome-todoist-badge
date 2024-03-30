import { storage } from "wxt/storage";
import { STORAGE_KEY_OF } from "../constants/storageKeys";
import { getTasksFilters } from "../utils";

export const handleActionClick = () => {
  chrome.action.onClicked.addListener(async () => {
    if (!(await storage.getItem<boolean>(STORAGE_KEY_OF.CONFIG.INITIALIZED)))
      await chrome.runtime.openOptionsPage();

    await openWebApp();
  });
};

const openWebApp = async () => {
  const { projectId, filterByDueByToday } = await getTasksFilters();
};
