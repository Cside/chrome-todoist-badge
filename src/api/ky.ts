import _ky from "ky";
import { camelCase, isObject, transform } from "lodash-es";

// これだとリクエストがパラで飛んだ時駄目。
// req id があれば一番楽だが...
const requestStartedAt: Map<string, number | undefined> = new Map();
const kyInstance = _ky.create({
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
  },
});

export const ky = {
  getCamelized: async <T>(url: string) => normalizeApiObject(await kyInstance.get(url).json()) as T,
};

export const normalizeApiObject = (obj: unknown): unknown =>
  transform(obj as object, (acc: Record<string, unknown>, value: unknown, key: string, target) => {
    const camelKey = Array.isArray(target) ? key : camelCase(key as string);
    acc[camelKey] = isObject(value) ? normalizeApiObject(value) : value ?? undefined;
  });
