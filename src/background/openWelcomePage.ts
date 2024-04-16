import { HASH_TO, PATH_TO } from "../constants/paths";

export const openWelcomePageOnInstalled = () => {
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL)
      await chrome.tabs.create({
        url: chrome.runtime.getURL(`${PATH_TO.OPTIONS}#${HASH_TO.WELCOME}`), // TODO ハードコーディング気になる…
        active: true,
      });
  });
};
