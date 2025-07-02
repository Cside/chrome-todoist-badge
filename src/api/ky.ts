import { camelCase, isObject } from "es-toolkit/compat";
import _ky from "ky";
import { transform } from "lodash-es"; // 未実装@2025/01 https://es-toolkit.slash.page/compatibility.html
import { MAX_RETRIES } from "../constants/maxRetry";
import { API_REST_BASE_URL } from "../constants/urls";
import { getLocaleTime } from "../fn/getLocaleTime";

const TIMEOUT = 10 * 1000; // same as default
const IS_SERVICE_WORKER = typeof window === "undefined";

// これだとリクエストがパラで飛んだ時駄目。
// req id があれば一番楽だが...
// FIXME これ、メモリリーク。。
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
      // NOTE: 各 try ごとのエラー処理。全 try がコケた後のエラー処理は catch {} で
      (req, _options, res) => {
        // logging ==============================================

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
          `color: ${String(res.status).startsWith("2") ? "darkcyan" : "darkgoldenrod"}`,
        );
      },
    ],
  },
  retry: IS_SERVICE_WORKER
    ? // NOTE: 本来はここは 0 にすべきで、pRetry 等で storage 等を含めた処理全体を retry すべき
      // 400, 401 等はリトライされない
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
