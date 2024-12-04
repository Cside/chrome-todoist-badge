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
        // FIXME これ🔽のエラーハンドリングですればよくない？
        //        副作用が。。。
        // タイムアウト頻発の調査に使っていたもの。一応今も残している。
        // message を破壊的変更するのは、お行儀が良くない気もするか⋯。
        const url = error.request.url;
        error.message +=
          // biome-ignore lint/style/useTemplate:
          `\n    url: ${url}` +
          extractFilter(url) +
          `\n    body: ${
            // FIXME ここで body を読むと、後続の処理で bodyUsed が true になってしまう。
            error.response.bodyUsed ? "" : await error.response.text()
          }`;
        return error;
      },
    ],
  },
  retry: IS_SERVICE_WORKER
    ? // 400, 401 等はリトライされない
      // https://github.com/sindresorhus/ky?tab=readme-ov-file#retry
      MAX_RETRIES
    : 0, // TQ がリトライするので、リトライしない
});

export const ky = {
  fetchAndNormalize: async <T>(url: string) =>
    normalizeApiObject(
      await kyInstance
        .get(
          // ky の仕様で、prefixUrl がある場合、url は / から始まってはいけない (なんじゃそりゃ⋯)
          // https://github.com/sindresorhus/ky?tab=readme-ov-file#prefixurl
          url.startsWith("/") ? url.slice(1) : url,
        )
        .json(),
    ) as T,
};

// ============================================================
// Utils
// ============================================================

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
