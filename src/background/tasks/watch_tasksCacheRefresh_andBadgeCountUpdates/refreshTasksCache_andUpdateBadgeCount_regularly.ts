import { addAlarmListener_andIdleStateListener } from "../fn/addAlarmListener";
import * as api from "./fn/refreshTasksCache_andUpdateBadgeCount";

export const INTERVAL_MINUTES = 15;

export const refreshTasksCache_andUpdateBadgeCount_regularly = () =>
  addAlarmListener_andIdleStateListener({
    name: "refresh-tasks-cache-and-update-badge-count", // NOTE: 一度リリースしたら変えちゃダメ...？
    intervalMinutes: INTERVAL_MINUTES,
    listener: async () => await api.refreshTasksCache_andUpdateBadgeCount(),
  });
