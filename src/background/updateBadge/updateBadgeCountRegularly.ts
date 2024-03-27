import { updateBadgeCountWithRetry } from "./updateBadgeCountWithRetry";

const ALARM_NAME = "update-count";
const INTERVAL_MINUTES = 15;

export const updateBadgeCountRegularly = () => {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    switch (alarm.name) {
      case ALARM_NAME: {
        await updateBadgeCountWithRetry({ via: "by alarm" });
        console.info(
          `Executed the alarm at ${new Date().toLocaleTimeString("ja-JP")}.\n` +
            `Next execution is at ${await getNextAlarmTime()}.`,
        );
        break;
      }
      default:
        throw new Error(`Unknown alarm name: ${alarm.name}`);
    }
  });

  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    await updateBadgeCountWithRetry({ via: "by alarm" }); // FIXME あるいは dev だけ毎回実行…？
    console.info(`Next execution is at ${await getNextAlarmTime()}.`);

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

const getNextAlarmTime = async () =>
  new Date((await chrome.alarms.get(ALARM_NAME)).scheduledTime).toLocaleTimeString("ja-JP");
