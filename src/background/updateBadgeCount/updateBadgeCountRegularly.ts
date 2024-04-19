import { formatDistance } from "date-fns";
import * as api from "./fn/updateBadgeCount";

const ALARM_NAME = "update-count";
export const INTERVAL_MINUTES = 15; // 別の場所に移してもいいかも…

export const updateBadgeCountRegularly = () => {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    switch (alarm.name) {
      case ALARM_NAME: {
        await api.updateBadgeCountWithRetry({ via: "alarm" });
        console.info(
          `Executed the alarm at ${new Date().toLocaleTimeString("ja-JP")}.\n` +
            `Next execution is at ${new Date(alarm.scheduledTime).toLocaleTimeString("ja-JP")}.`,
        );
        break;
      }
      default:
        throw new Error(`Unknown alarm name: ${alarm.name}`);
    }
  });

  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    const alarm = await chrome.alarms.get(ALARM_NAME);
    if (alarm) {
      const nextTime = formatDistance(new Date(alarm.scheduledTime), new Date(), {
        addSuffix: true,
      });
      console.info(`Next execution is ${nextTime}.`);
    }

    if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

    await chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 0,
      periodInMinutes: INTERVAL_MINUTES,
    });
    console.info("Created alarm");
  });
};
