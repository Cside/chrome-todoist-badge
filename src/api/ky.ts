import camelcaseKeysDeep from "camelcase-keys-deep";
import _ky from "ky";
import {} from "vitest/dist/reporters-P7C2ytIv.js";

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
  getCamelized: async <T>(url: string) => camelcaseKeysDeep(await kyInstance.get(url).json()) as T,
};
