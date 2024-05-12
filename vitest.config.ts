import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
    mockReset: true,
    restoreMocks: true,
    chaiConfig: {
      truncateThreshold: 100,
    },
  },
  plugins: [WxtVitest()],
});
