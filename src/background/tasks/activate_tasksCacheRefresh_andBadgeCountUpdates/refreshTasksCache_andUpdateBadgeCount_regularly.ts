import { addAlarmListener } from "../fn/addAlarmListener";
import * as api from "./fn/refreshTasksCache_andUpdateBadgeCount";

export const INTERVAL_MINUTES = 15;

export const refreshTasksCache_andUpdateBadgeCount_regularly = () =>
  addAlarmListener({
    name: "refresh-tasks-cache-and-update-badge-count",
    intervalMinutes: INTERVAL_MINUTES,
    listener: async () =>
      await api.refreshTasksCache_andUpdateBadgeCount_withRetry(),
  });
