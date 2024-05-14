import { ONE_MINUTE } from "../../../constants/time";
import { API_URL_MATCH_PATTERN_FOR } from "../../../constants/urls";
import { InMemoryCache } from "../../InMemoryCache";

const decoder = new TextDecoder("utf-8");
const cache = new InMemoryCache<string>({ ttl: ONE_MINUTE });

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const requestBody = details.requestBody?.raw?.[0]?.bytes;
    if (requestBody)
      try {
        const parsed = JSON.parse(decoder.decode(requestBody)) as {
          commands: { type: string }[];
        };
        const firstCommand = parsed.commands[0]?.type;
        if (firstCommand !== undefined) cache.set(details.requestId, firstCommand);
      } catch (error) {
        console.error(`Failed to parse request body. error: ${error}`);
      }
  },
  { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
  ["requestBody"],
);

export const addCommandListener = ({
  name,
  commandRegExp,
  listener,
}: {
  name: string;
  commandRegExp: RegExp;
  listener: () => Promise<unknown>;
}) => {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      const command = cache.get(details.requestId);
      if (command !== undefined) {
        const matched = commandRegExp.test(command);
        if (matched)
          try {
            await listener();
            console.info(`[command: ${command}] ${name}`);
          } catch (error) {
            console.error(
              `[command: ${command}] Failed to executer. error: `,
              error,
            );
          }
      }
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
    ["responseHeaders"],
  );
};
