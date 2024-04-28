import { ONE_MINUTE } from "../../constants/time";
import { API_URL_MATCH_PATTERN_FOR } from "../../constants/urls";
import { Cache } from "../Cache";
import * as api from "./fn/updateBadgeCount";

const decoder = new TextDecoder("utf-8");
const cache = new Cache<string>({ ttl: ONE_MINUTE });

export const updateBadgeCountOnTaskUpdated = () => {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const requestBody = details.requestBody?.raw?.[0]?.bytes;
      if (requestBody) {
        try {
          const parsed = JSON.parse(decoder.decode(requestBody)) as {
            commands: { type: string }[];
          };
          const firstCommand = parsed.commands[0]?.type;
          if (firstCommand !== undefined) cache.set(details.requestId, firstCommand);
        } catch (error) {
          console.error(`Failed to parse request body. error: ${error}`);
        }
      }
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
    ["requestBody"],
  );
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      const command = cache.get(details.requestId);
      if (command !== undefined) {
        console.log(`Command: ${command}`);
        if (/^(item_|section_move$|section_delete$)/.test(command))
          await api.updateBadgeCountWithRetry({ via: "on task updated on Todoist Web App" });
      }
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
    ["responseHeaders"],
  );
};
