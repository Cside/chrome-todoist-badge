import type {} from "../../../types";
import { addCommandListener, createListener } from "../fn/addCommandListener";
import * as api from "./fn/refreshProjectsCache";

const REGEXP = [
  // https://www.notion.so/97e7a56e72894496add5f649c56c78bd
  "^project_",
];

const listener = createListener({
  name: "refresh-projects-cache",
  commandRegExp: new RegExp(REGEXP.join("|")),
  listener: async () => await api.refreshProjectsCache(),
});

export const refreshProjectsCache_onProjectsUpdated = () =>
  addCommandListener(listener);

export const unwatch_projectsCacheRefresh = () =>
  chrome.webRequest.onCompleted.removeListener(listener);
