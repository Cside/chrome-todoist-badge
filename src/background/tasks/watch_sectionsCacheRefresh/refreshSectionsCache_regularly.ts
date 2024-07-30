import { addAlarmListener } from "../fn/addAlarmListener";
import { refreshSectionsCache_withRetry } from "./fn/refreshSectionsCache_withRetry";

const INTERVAL_MINUTES = 15;

export const refreshSectionsCache_regularly = async () =>
  addAlarmListener({
    name: "refresh-sections-cache",
    intervalMinutes: INTERVAL_MINUTES,
    listener: async () => refreshSectionsCache_withRetry(),
  });
