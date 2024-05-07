export const getLocaleTime = (unixTime?: number) =>
  new Date(unixTime ?? Date.now()).toLocaleTimeString("ja-JP");
