import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";
import { API_BASE_URL, APP_BASE_URL } from "./src/constants/urls";

export default defineConfig({
  vite: () => ({
    plugins: [
      // TODO: Known issue: これを入れると、type: module 指定してるにも関わらず、下記の警告が出る
      // The CJS build of Vite's Node API is deprecated. See https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
      // Issue 検索しても無し：https://www.google.com/search?q=The+CJS+build+of+Vite%27s+Node+API+is+deprecated.+%40vitejs%2Fplugin-react+OR+site%3Ahttps%3A%2F%2Fgithub.com%2Fvitejs%2Fvite-plugin-react
      react(),
    ],
  }),
  manifest: {
    host_permissions: [
      `${API_BASE_URL}/*`, // Tasks API, Projects API, etc...
      `${APP_BASE_URL}/*`, // Sync API
    ],
    permissions: ["storage", "unlimitedStorage", "webRequest", "alarms", "idle"],
    action: {},
  },
});
