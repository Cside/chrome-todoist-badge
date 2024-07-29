import { ONE_MINUTE } from "../../../constants/time";
import { API_URL_MATCH_PATTERN_FOR } from "../../../constants/urls";
import { label } from "../../../fn/label";
import { InMemoryCache } from "../../InMemoryCache";

const decoder = new TextDecoder("utf-8");
const cache = new InMemoryCache<string>({ ttl: ONE_MINUTE });

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const requestBody = details.requestBody?.raw?.[0]?.bytes;
    if (requestBody)
      try {
        const requestBodyJson = decoder.decode(requestBody);
        const parsed = JSON.parse(requestBodyJson) as {
          commands?: { type: string }[];
        };
        if (parsed.commands === undefined) {
          console.error(`commands is undefined. requestBody: ${requestBodyJson}`);
          return;
        }
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
      /* NOTE: リクエストが開始してからレスポンスが返ってくるまでの間に
         拡張が update されると、キャッシュが消し飛ぶので見つからない。
         まぁそのケースがマシだし、万が一起こったとしても、次に Popup を開けば整合性は取れる。
      */
      const command = cache.get(details.requestId);
      if (command !== undefined) {
        const matched = commandRegExp.test(command);
        if (matched)
          try {
            await listener();
            console.info(`${label(`command: ${command}`)} ${name}`);
          } catch (error) {
            console.error(
              `${label(`command: ${command}`)} Failed to executer. error: `,
              error,
            );
          }
      }
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
    ["responseHeaders"],
  );
};
