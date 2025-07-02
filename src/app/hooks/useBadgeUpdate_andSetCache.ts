import useAsyncEffect from "use-async-effect";
import { setBadgeText } from "../../fn/setBadgeText";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import type { Api } from "../../types";

export const useBadgeUpdate_andSetCache = (params: {
  tasks: Api.Task[] | undefined;
  areTasksLoaded: boolean;
}) => {
  const { tasks, areTasksLoaded } = params as
    | { tasks: Api.Task[]; areTasksLoaded: true }
    | { tasks: undefined; areTasksLoaded: false };

  useAsyncEffect(async () => {
    if (areTasksLoaded) {
      await setBadgeText(tasks.length);
      await storage.setItem<Api.Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);
    }
  }, [tasks, areTasksLoaded]);
};
