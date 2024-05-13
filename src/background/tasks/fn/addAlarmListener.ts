import { formatDistance } from "date-fns";
import { getLocaleTime } from "../../../fn/getLocaleTime";

const prevStateMap = new Map<string, chrome.idle.IdleState>();

export const addAlarmListener = async ({
  name,
  intervalMinutes,
  listener,
}: {
  name: string;
  intervalMinutes: number;
  listener: () => Promise<void>;
}) => {
  const alarm = await chrome.alarms.get(name);
  if (alarm) {
    const nextTime = formatDistance(new Date(alarm.scheduledTime), new Date(), {
      addSuffix: true,
    });
    console.info(`[${name}] Alarm exists. Next execution is ${nextTime}.`);
  } else {
    await chrome.alarms.create(name, {
      delayInMinutes: 0,
      periodInMinutes: intervalMinutes,
    });
    console.info(`[${name}] Created alarm`);
  }

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (
      alarm.name === name &&
      (await chrome.idle.queryState(10_000)) === "active"
    )
      try {
        await listener();
        console.info(
          `[${name}] Alarm: Executed at ${getLocaleTime()}.\n` +
            `    Next execution is at ${getLocaleTime(alarm.scheduledTime)}.`,
        );
      } catch (error) {
        console.error(`[${name}] Alarm: Failed to execute. error: `, error);
      }
  });

  chrome.idle.onStateChanged.addListener(async (idleState) => {
    const prevState = prevStateMap.get(name);
    prevStateMap.set(name, idleState);

    // idle -> active の時に発火してほしくないので currentState === 'active' じゃ駄目
    if (prevState === "locked")
      try {
        await listener();
        console.info(`[${name}] onActive: Executed at ${getLocaleTime()}.`);
      } catch (error) {
        console.error(`[${name}] onActive: Failed to execute. error: `, error);
      }
  });
};
