import _ky, { HTTPError, TimeoutError } from "ky";
import { camelCase, isObject, transform } from "lodash-es";
import { MAX_RETRY } from "../constants/maxRetry";
import { STATUS_CODE_FOR } from "../constants/statusCodes";
import { API_REST_BASE_URL } from "../constants/urls";
import { getLocaleTime } from "../fn/getLocaleTime";

const TIMEOUT = 10 * 1000; // same as default
const IS_SERVICE_WORKER = typeof window === "undefined";

// これだとリクエストがパラで飛んだ時駄目。
// req id があれば一番楽だが...
const requestStartedAt: Map<string, number | undefined> = new Map();
const getFilter = (url: string) => {
  const filter = new URL(url).searchParams.get("filter");
  if (filter === null) return "";
  return `  ${filter}`;
};

const kyInstance = _ky.create({
  timeout: TIMEOUT,
  prefixUrl: API_REST_BASE_URL,
  hooks: {
    beforeRequest: [
      (req) => {
        requestStartedAt.set(req.url, Date.now());
      },
    ],
    afterResponse: [
      (req, _options, res) => {
        // logging
        const startedAt = requestStartedAt.get(req.url);
        if (startedAt === undefined) {
          console.warn(`startedAt (url: ${req.url}) is undefined`);
          return;
        }
        const elapsed = `${((Date.now() - startedAt) / 1_000).toFixed(2)}ms`;

        console.info(
          [
            `%c${getLocaleTime()}`,
            `(${elapsed})`,
            `${res.status}`,
            `${req.method} ${req.url}${getFilter(req.url)}`,
          ].join("\t"),
          `color: ${
            String(res.status).startsWith("2") ? "darkcyan" : "darkgoldenrod"
          }`,
        );
      },
    ],
    // HTTPError を modify するもの。Timeout では呼ばれない
    beforeError: [
      async (error) => {
        const url = error.request.url;
        error.message +=
          // biome-ignore lint/style/useTemplate:
          `\n    url: ${url}` +
          extractFilter(url) +
          `\n    body: ${
            error.response.bodyUsed ? "" : await error.response.text()
          }`;
        return error;
      },
    ],
  },
  ...(IS_SERVICE_WORKER
    ? // 400, 401 等はリトライされない
      // https://github.com/sindresorhus/ky?tab=readme-ov-file#retry
      { retry: MAX_RETRY }
    : {}),
});

export const ky = {
  fetchAndNormalize: async <T>(url: string) => {
    try {
      return normalizeApiObject(
        await kyInstance
          .get(
            // ky の仕様で、prefixUrl がある場合、url は / から始まってはいけない
            // https://github.com/sindresorhus/ky?tab=readme-ov-file#prefixurl
            url.startsWith("/") ? url.slice(1) : url,
          )
          .json(),
      ) as T;
    } catch (error) {
      if (
        error instanceof HTTPError &&
        error.response.status === STATUS_CODE_FOR.BAD_REQUEST
      ) {
        /* FIXME
          - throw じゃなくて console.error で本当にいいの？
          - ここで throw した場合、worker はどうなるの？ retry される？ retry していいの？
      */
        console.error(
          `Bad request. storage will be cleared. url: ${url}, error: ${error}`,
        );
        await chrome.storage.local.clear();
      }

      // TimeoutError の場合、ky の beforeError 等が発火しないため、ここでやる
      /* NOTE: error.message の最後に追加する、をやらない理由：
         TimeoutError オブジェクトを throw すると、
         なぜか、変更した error.message が無視される */
      throw error instanceof TimeoutError
        ? new Error(
            // biome-ignore format:
            // biome-ignore lint/style/useTemplate:
            "Request timed out" +
            `\n  url: ${url}` +
            extractFilter(url) +
            `\n  timeout: ${TIMEOUT}ms`,
          )
        : error;
    }
  },
};

// 1. camelize
// 2. null -> undefined
export const normalizeApiObject = (obj: unknown): unknown =>
  transform(
    obj as object,
    (acc: Record<string, unknown>, value: unknown, key: string, target) => {
      const camelKey = Array.isArray(target) ? key : camelCase(key as string);
      acc[camelKey] = isObject(value)
        ? normalizeApiObject(value)
        : (value ?? undefined);
    },
  );

// ==================================================
// Utils
// ==================================================

const extractFilter = (url: string): string => {
  const filter = new URL(url).searchParams.get("filter");
  return filter !== null ? `\n    filter: ${filter}` : "";
};
