import { formatDistance } from "date-fns";
import { ONE_MINUTE } from "../../../constants/time";
import { getLocaleTime } from "../../../fn/getLocaleTime";
import { label } from "../../../fn/label";

const prevStateMap = new Map<string, chrome.idle.IdleState>();

export const addAlarmListener_andIdleStateListener = async ({
  name,
  intervalMinutes,
  listener,
}: {
  name: string;
  intervalMinutes: number;
  listener: () => Promise<void>;
}) => {
  // ==================================================
  // Create Alarm
  // ==================================================
  const alarm = await chrome.alarms.get(name);
  if (alarm) {
    const nextTime = formatDistance(new Date(alarm.scheduledTime), new Date(), {
      addSuffix: true,
    });
    console.info(`${label(name)} ⏰Alarm exists. Next execution is ${nextTime}.`);
  } else {
    await chrome.alarms.create(name, {
      delayInMinutes: 0,
      periodInMinutes: intervalMinutes,
    });
    console.info(`${label(name)} ⏰Created alarm`);
  }

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === name && (await getCurrentIdleState()) === "active")
      try {
        await listener();
        console.info(
          // biome-ignore format:
          `${label(name)} ⏰Alarm: Executed at ${getLocaleTime(alarm.scheduledTime)}.` +
            `\n    Next execution is at ${getLocaleTime(alarm.scheduledTime + intervalMinutes * ONE_MINUTE)}.`,
        );
      } catch (error) {
        console.error(`${label(name)} ⏰Alarm: Failed to execute. error: `, error);
      }
  });

  // ==================================================
  // Idle State Listener
  // ==================================================
  // 🔥🔥🔥これ、この関数が呼ばれるたびに呼ぶのは筋悪なような⋯
  // でも、後方互換性を考えたらもう変更できないかなぁ⋯
  chrome.idle.onStateChanged.addListener(async (idleState) => {
    const prevState = prevStateMap.get(name);
    prevStateMap.set(name, idleState);

    // idle -> active の時に発火してほしくないので currentState === 'active' じゃ駄目
    if (prevState === "locked")
      try {
        await listener();
        console.info(`${label(name)} 💡onActive: Executed at ${getLocaleTime()}.`);
      } catch (error) {
        console.error(
          `${label(name)} 💡onActive: Failed to execute. error: `,
          error,
        );
      }
  });
};

// ==================================================
// Utils
// ==================================================

const getCurrentIdleState = async () =>
  await chrome.idle.queryState(
    // 適当に数値を入れる必要がある
    // https://developer.chrome.com/docs/extensions/mv2/reference/idle?hl=ja#method-queryState
    10_000,
  );
