export const addMessageListeners = () => {
  chrome.runtime.onMessage.addListener(async (req) => {
    switch (req.action) {
      case "open-options-page":
        await chrome.runtime.openOptionsPage();
        break;
      default:
        throw new Error(`Unknown action: ${JSON.stringify(req)}`);
    }
  });
};
