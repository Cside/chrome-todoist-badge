import "@/src/globalUtils";
import { startBackground } from "@/src/background/background";

// // FIXME
// const now = () => new Date().toLocaleTimeString("ja-JP");
//
// let cnt = 0;
// let idleState = "active";
// async function checkAlarmState() {
//   chrome.idle.onStateChanged.addListener((newIdleState) => {
//     console.log(`### ${now()} (stateChanged) ${idleState} -> ${newIdleState}`);
//     idleState = newIdleState;
//   });
//
//   const NAME = "test-alarm";
//   chrome.alarms.onAlarm.addListener(async (alarm) => {
//     if (alarm.name === NAME)
//       console.log(
//         `### ${now()} ${await chrome.idle.queryState(10000)} (${++cnt}) next: ${new Date(
//           alarm.scheduledTime + 30 * 1_000,
//         ).toLocaleTimeString("ja-JP")}`,
//       );
//   });
//
//   const alarm = await chrome.alarms.get("my-alarm");
//   if (!alarm) {
//     console.log("### create alarm");
//     await chrome.alarms.create(NAME, {
//       delayInMinutes: 0,
//       periodInMinutes: 0.5,
//     });
//   } else console.log("### alarm exists");
// }
//
// export default defineBackground(() => {
//   startBackground();
//
//   (async () => {
//     await checkAlarmState();
//   })();
// });

export default defineBackground(() => startBackground());
