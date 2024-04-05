import { API_BASE_URL } from "@/src/constants/urls";
import { mount } from "@/src/content/mount";

export default defineContentScript({
  matches: [`${API_BASE_URL}/*`],
  cssInjectionMode: "ui",

  async main(ctx) {
    await mount(ctx);
  },
});
