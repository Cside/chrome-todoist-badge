import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { storage as wxtStorage } from "wxt/storage";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import * as storage from "../../storage/useStorage";
import type { Api, TaskFilters } from "../../types";
import { QUERY_KEY_FOR } from "../queryKeys";
import * as api from "./getTasks";

// from Options
export const useTasks = ({
  filters,
  deps,
  cache,
  enabled = true,
}: {
  filters: TaskFilters;
  deps: unknown[];
  cache?: Api.Task[] | undefined;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.TASKS, ...deps],
    queryFn: async () => {
      const tasks = await api.getTasksByParams(filters);
      // TODO: useMutation 使わなくて良いんだっけ？
      await wxtStorage.setItem<Api.Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks); // retry はサボる
      return tasks;
    },
    enabled,
    ...(cache && {
      placeholderData: (prevData) => (prevData !== undefined ? undefined : cache),
    }),
  });

// from Tasks
export const useCachedTasks = ({
  isCacheAvailable,
}: { isCacheAvailable: boolean }) => {
  // NOTE: 現状 ここでしか使ってない関数。共通関数化して良かったのだろうか…
  const [projectId] = storage.useFilteringProjectId_Suspended();
  const [filterByDueByToday] = storage.useFilterByDueByToday_Suspended();
  const [sectionId] = storage.useFilteringSectionId_Suspended();

  const [cache] = storage.useCachedTasks_Suspended();

  return useTasks({
    filters: { projectId, filterByDueByToday, sectionId },
    deps: [projectId, filterByDueByToday, sectionId],
    cache: isCacheAvailable ? cache : undefined,
  }) as UseQueryResult<Api.Task[]>;
};
