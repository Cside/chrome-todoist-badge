import { addAlarmListener_andIdleStateListener } from "../fn/addAlarmListener";
import { refreshSectionsCache_withRetry } from "./fn/refreshSectionsCache_withRetry";

const INTERVAL_MINUTES = 15;

export const refreshSectionsCache_regularly = async () =>
  addAlarmListener_andIdleStateListener({
    name: "refresh-sections-cache", // NOTE: 一度リリースしたら変えちゃダメ...？
    intervalMinutes: INTERVAL_MINUTES,
    listener: async () => refreshSectionsCache_withRetry(),
  });
