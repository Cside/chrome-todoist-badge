import { formatDistance } from "date-fns";
import { updateBadgeCountWithRetry } from "./updateBadgeCount";

const ALARM_NAME = "update-count";
const INTERVAL_MINUTES = 15;

export const updateBadgeCountRegularly = () => {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    switch (alarm.name) {
      case ALARM_NAME: {
        await updateBadgeCountWithRetry({ via: "alarm" });
        console.info(
          `Executed the alarm at ${new Date().toLocaleTimeString("ja-JP")}.\n` +
            `Next execution is at ${(await getNextAlarmDate()).toLocaleTimeString("ja-JP")}.`,
        );
        break;
      }
      default:
        throw new Error(`Unknown alarm name: ${alarm.name}`);
    }
  });

  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (import.meta.env.DEV) await updateBadgeCountWithRetry({ via: "reloading the extension" });

    const nextTime = formatDistance(await getNextAlarmDate(), new Date(), { addSuffix: true });
    console.info(`Next execution is ${nextTime}.`);

    if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

    await chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 0,
      periodInMinutes: INTERVAL_MINUTES,
    });
    console.info("Created alarm");
  });
};

//================================================================
// Utils
//================================================================

const getNextAlarmDate = async () => new Date((await chrome.alarms.get(ALARM_NAME)).scheduledTime);
