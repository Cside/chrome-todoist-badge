const ALARM_NAME = "update-count";
const INTERVAL_MINUTES = 15;

let cnt = 0;
const updateCount = async () => await chrome.action.setBadgeText({ text: String(++cnt) });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case ALARM_NAME: {
      const now = new Date().toLocaleTimeString("ja-JP");
      const nextTime = new Date(
        (await chrome.alarms.get(ALARM_NAME)).scheduledTime,
      ).toLocaleTimeString("ja-JP");

      await updateCount();
      console.info(`Executed the alarm at ${now}.\nNext execution is ${nextTime}.`);
      break;
    }
    default:
      throw new Error(`Unknown alarm name: ${alarm.name}`);
  }
});

const updateRegularly = () => {
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

    await chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 0,
      periodInMinutes: INTERVAL_MINUTES,
    });
    console.info("Created alarm");
  });
};

export const start = () => {
  updateRegularly();
};
