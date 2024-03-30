import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing";

export default defineConfig({
  test: {
    globals: true,
    mockReset: true,
    restoreMocks: true,
  },
  plugins: [WxtVitest()],
});
