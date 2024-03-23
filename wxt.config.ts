import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    host_permissions: ["https://api.todoist.com/*", "https://app.todoist.com/*"],
    permissions: ["storage", "unlimitedStorage", "webRequest", "alarms"],
  },
});
