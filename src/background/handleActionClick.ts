import { storage } from "wxt/storage";
import { STORAGE_KEY_OF } from "../constants/storageKeys";

export const handleActionClick = () => {
  chrome.action.onClicked.addListener(async () => {
    if (!(await storage.getItem<boolean>(STORAGE_KEY_OF.CONFIG.INITIALIZED)))
      await chrome.runtime.openOptionsPage();

    await openWebApp();
  });
};

const openWebApp = async () => {};
