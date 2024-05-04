import _ky, { TimeoutError } from "ky";
import { camelCase, isObject, transform } from "lodash-es";

const TIMEOUT = 10 * 1000; // same as default

// これだとリクエストがパラで飛んだ時駄目。
// req id があれば一番楽だが...
const requestStartedAt: Map<string, number | undefined> = new Map();
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
          // biome-ignore format:
          `(${elapsed}) ${res.status} ${req.method} ${req.url} ${new Date().toLocaleTimeString("ja-JP")}`,
        );
      },
    ],
    beforeError: [
      async (error) => {
        error.message +=
          `\n    url: ${error.request.url}` +
          `\n    body: ${error.response.bodyUsed ? "" : await error.response.text()}`;
        return error;
      },
    ],
  },
});

export const ky = {
  getCamelized: async <T>(url: string) => {
    try {
      return normalizeApiObject(await kyInstance.get(url).json()) as T;
    } catch (error) {
      // TimeoutError の場合、ky の beforeError 等が発火しないため、ここでやる
      if (error instanceof TimeoutError) error.message += `\n    url: ${url}, timeout: ${TIMEOUT}`;
      throw error;
    }
  },
};

export const normalizeApiObject = (obj: unknown): unknown =>
  transform(obj as object, (acc: Record<string, unknown>, value: unknown, key: string, target) => {
    const camelKey = Array.isArray(target) ? key : camelCase(key as string);
    acc[camelKey] = isObject(value) ? normalizeApiObject(value) : value ?? undefined;
  });
