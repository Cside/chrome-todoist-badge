import { API_URL_MATCH_PATTERN_FOR } from "@/src/constants/urls";

const decoder = new TextDecoder("utf-8");

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const requestBody = details.requestBody?.raw?.[0].bytes;
      if (requestBody) {
        try {
          const parsed = JSON.parse(decoder.decode(requestBody)) as {
            commands: { type: string }[];
          };
          const firstCommand = parsed.commands[0];
          if (firstCommand) console.log(firstCommand.type);
        } catch (error) {
          throw new Error(`Failed to parse request body. error: ${error}`);
        }
      }
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
    ["requestBody"], // "extraHeaders"
  );
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      console.log("onCompleted", details.requestId);
      // await api.updateBadgeCountWithRetry({ via: "on task updated on Todoist Web App" }); // FIXME
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
    ["responseHeaders"], // "extraHeaders"
  );
};
