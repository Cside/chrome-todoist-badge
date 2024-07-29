import { mapValues } from "lodash-es";

export const PATHNAME_FOR = {
  OPTIONS: "/options.html",
  TASKS: "/popup.html",
} as const;

export const PATH_TO = {
  OPTIONS: "/options",
  TASKS: "/tasks",
  WELCOME: "/welcome",
  PIN_EXTENSION_TO_TOOLBAR: "/pin-extension-to-toolbar",
} as const;

export const HASH_FOR = mapValues(PATH_TO, (value) => `#${value}`);
