import { HASH_FOR, PATHNAME_FOR } from "../../constants/paths";

export const openWelcomePageOnInstalled = () => {
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL)
      await chrome.tabs.create({
        url: chrome.runtime.getURL(`${PATHNAME_FOR.OPTIONS}${HASH_FOR.WELCOME}`),
        active: true,
      });
  });
};
