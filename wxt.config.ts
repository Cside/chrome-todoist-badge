import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";
import { API_BASE_URL, APP_BASE_URL } from "./src/constants/urls";

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    host_permissions: [
      `${API_BASE_URL}/*`, // Tasks API, Projects API, etc...
      `${APP_BASE_URL}/*`, // Sync API
    ],
    permissions: ["storage", "unlimitedStorage", "webRequest", "alarms", "idle"],
  },
});
