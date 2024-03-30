declare namespace chrome.alarms {
  export const get: (name: string) => Promise<Alarm | undefined>;
}
