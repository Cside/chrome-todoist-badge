import { useSuspenseQuery } from "@tanstack/react-query";

const CHECK_INTERVAL = 500;

export const useIsOnToolbar_Suspended = () =>
  useSuspenseQuery({
    queryKey: ["isOnToolbar"],
    queryFn: async () => (await chrome.action.getUserSettings()).isOnToolbar,
    refetchInterval: (query) => (query.state.data === true ? false : CHECK_INTERVAL),
  }).data;
