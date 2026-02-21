import { addCommandListener, createListener } from "../fn/addCommandListener";
import * as api from "./fn/refreshTasksCache_andUpdateBadgeCount";

const REGEXP = [
  // https://www.notion.so/97e7a56e72894496add5f649c56c78bd
  "^item_",
  "^section_move$",
  "^section_delete$",
  "^project_delete$",
];

const listener = createListener({
  name: "refresh-tasks-cache-and-update-badge-count",
  commandRegExp: new RegExp(REGEXP.join("|")),
  listener: async () => await api.refreshTasksCache_andUpdateBadgeCount(),
});

export const refreshTasksCache_andUpdateBadgeCount_onTaskUpdated = () =>
  addCommandListener(listener);

export const unwatch_tasksCacheRefresh_andBadgeCountUpdates = () =>
  chrome.webRequest.onCompleted.removeListener(listener);
