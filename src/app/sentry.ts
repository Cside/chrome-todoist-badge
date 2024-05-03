import * as Sentry from "@sentry/react";
import { version } from "../../package.json";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "https://c7039254d1875b1ff671073ed82c4067@o49171.ingest.us.sentry.io/4507191948410880",
    release: version,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.captureConsoleIntegration({
        levels: ["warn", "error"],
      }),
    ],
  });
  const updateUrl = chrome.runtime.getManifest().update_url;
  Sentry.setTag("custom.store", getStore(updateUrl));
}

// utils
function getStore(updateUrl: string | undefined) {
  if (updateUrl === undefined) return "Development";
  if (updateUrl.includes("google")) return "Chrome";
  if (updateUrl.includes("edge")) return "Edge";

  console.error(`Unknown store: ${updateUrl}`);
  return updateUrl;
}
