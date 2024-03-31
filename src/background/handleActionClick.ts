import { storage } from "wxt/storage";
import { STORAGE_KEY_OF } from "../constants/storageKeys";
import { WEB_APP_URL_OF } from "../constants/urls";
import { getTasksFilters } from "../fn/getTasksFilters";

export const addActionClickListener = () => {
  chrome.action.onClicked.addListener(async () => {
    if (await storage.getItem<boolean>(STORAGE_KEY_OF.CONFIG.INITIALIZED)) {
      await openWebApp();
      return;
    }
    await chrome.runtime.openOptionsPage();
  });
};

const openWebApp = async () => {
  const webAppUrl = await getWebAppUrl();
  chrome.tabs.create({ url: webAppUrl });
};

const getWebAppUrl = async () => {
  const { projectId } = await getTasksFilters();
  return projectId === undefined ? WEB_APP_URL_OF.HOME : WEB_APP_URL_OF.PROJECT_OF(projectId);
};
