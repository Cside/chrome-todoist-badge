import { formatDistance } from "date-fns";

type Name = "refresh-tasks-cache-and-update-badge-count" | "refresh-sections-cache";

export const addAlarmListener = async ({
  name,
  intervalMinutes,
  listener,
}: { name: Name; intervalMinutes: number; listener: () => Promise<void> }) => {
  const alarm = await chrome.alarms.get(name);
  if (alarm) {
    const nextTime = formatDistance(new Date(alarm.scheduledTime), new Date(), {
      addSuffix: true,
    });
    console.info(`[${name}] Next execution is ${nextTime}.`);
  } else {
    await chrome.alarms.create(name, {
      delayInMinutes: 0,
      periodInMinutes: intervalMinutes,
    });
    console.info(`[${name}] Created alarm`);
  }

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === name && (await chrome.idle.queryState(10_000)) === "active") {
      await listener();
      console.info(
        `[${name}] Executed the alarm at ${new Date().toLocaleTimeString("ja-JP")}.\n` +
          `    Next execution is at ${new Date(alarm.scheduledTime).toLocaleTimeString("ja-JP")}.`,
      );
    }
  });

  chrome.idle.onStateChanged.addListener(async (idleState) => {
    if (idleState === "active") await listener();
  });
};
