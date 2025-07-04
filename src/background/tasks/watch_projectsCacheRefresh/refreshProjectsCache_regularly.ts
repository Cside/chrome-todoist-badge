import { addAlarmListener_andIdleStateListener } from "../fn/addAlarmListener";
import { refreshProjectsCache } from "./fn/refreshProjectsCache";

const INTERVAL_MINUTES = 15;

export const refreshProjectsCache_regularly = async () =>
  addAlarmListener_andIdleStateListener({
    name: "refresh-projects-cache", // NOTE: 一度リリースしたら変えちゃダメ...？
    intervalMinutes: INTERVAL_MINUTES,
    listener: async () => refreshProjectsCache(),
  });
