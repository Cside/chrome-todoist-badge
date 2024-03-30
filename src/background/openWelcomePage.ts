export const openWelcomePageOnInstalled = () => {
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL)
      await chrome.tabs.create({
        url: chrome.runtime.getURL("/welcome.html"),
        active: true,
      });
  });
};
