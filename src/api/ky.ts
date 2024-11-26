import _ky, { TimeoutError } from "ky";
import { camelCase, isObject, transform } from "lodash-es";
import { getLocaleTime } from "../fn/getLocaleTime";

const TIMEOUT = 10 * 1000; // same as default

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
  hooks: {
    beforeRequest: [
      (req) => {
        requestStartedAt.set(req.url, Date.now());
      },
    ],
    afterResponse: [
      (req, _options, res) => {
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
});

export const ky = {
  fetchAndNormalize: async <T>(url: string) => {
    try {
      return normalizeApiObject(await kyInstance.get(url).json()) as T;
    } catch (error) {
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
        : value ?? undefined;
    },
  );

// ==================================================
// Utils
// ==================================================

const extractFilter = (url: string): string => {
  const filter = new URL(url).searchParams.get("filter");
  return filter !== null ? `\n    filter: ${filter}` : "";
};
