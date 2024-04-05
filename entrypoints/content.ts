import { mount } from "@/src/content/mount";

export default defineContentScript({
  // 変数が使えない。https://wxt.dev/guide/entrypoints.html#side-effects
  matches: ["https://api.todoist.com/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    await mount(ctx);
  },
});
