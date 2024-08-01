import color from "chalk";
import { ONE_MINUTE } from "../../../constants/time";
import { API_URL_MATCH_PATTERN_FOR } from "../../../constants/urls";
import { label } from "../../../fn/label";
import { InMemoryCache } from "../../InMemoryCache";

const decoder = new TextDecoder("utf-8");
const cache = new InMemoryCache<string>({ ttl: ONE_MINUTE });

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const requestBody = details.requestBody?.raw?.[0]?.bytes;
    if (requestBody === undefined) {
      console.info("requestBody is undefined");
      return;
    }
    const requestBodyJson = decoder.decode(requestBody);
    const parsed = (() => {
      try {
        return JSON.parse(requestBodyJson) as {
          commands?: { type: string }[];
        };
      } catch (error) {
        throw new SyntaxError(
          `Failed to parse JSON of request body. error: ${error}`,
        );
      }
    })();

    if (parsed.commands === undefined) {
      // command 無しで Sync API が叩かれることはあるだろうから、これは正常系。
      console.info(`commands is undefined. requestBody: ${requestBodyJson}`);
      return;
    }
    const firstCommand = parsed.commands[0]?.type;
    if (firstCommand === undefined) {
      console.error(`parsed.commands[] is empty. requestBody: ${requestBodyJson}`);
      return;
    }
    cache.set(details.requestId, firstCommand);
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
            console.info(`${label(name)} ${labelForCommand(command)}`);
          } catch (error) {
            console.error(
              `${labelForCommand(command)} Failed to executer. error: `,
              error,
            );
          }
      }
    },
    { urls: [API_URL_MATCH_PATTERN_FOR.SYNC] },
    ["responseHeaders"],
  );
};

export const labelForCommand = (name: string) =>
  color.bgHex("#00a381").black(` command: ${name} `);
