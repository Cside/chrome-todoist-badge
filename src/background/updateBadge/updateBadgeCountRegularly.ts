import { updateBadgeCount } from "./updateBadgeCount";

const ALARM_NAME = "update-count";
const INTERVAL_MINUTES = 15;

export const updateBadgeCountRegularly = () => {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    switch (alarm.name) {
      case ALARM_NAME: {
        const now = new Date().toLocaleTimeString("ja-JP");
        const nextTime = new Date(
          (await chrome.alarms.get(ALARM_NAME)).scheduledTime,
        ).toLocaleTimeString("ja-JP");

        await updateBadgeCount();
        console.info(`Executed the alarm at ${now}.\nNext execution is at ${nextTime}.`);
        break;
      }
      default:
        throw new Error(`Unknown alarm name: ${alarm.name}`);
    }
  });

  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

    await chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 0,
      periodInMinutes: INTERVAL_MINUTES,
    });
    console.info("Created alarm");
  });
};
