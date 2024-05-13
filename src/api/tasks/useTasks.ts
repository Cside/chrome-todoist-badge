import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import * as storage from "../../storage/useStorage";
import type { Task, TaskFilters } from "../../types";
import { QUERY_KEY_FOR } from "../queryKeys";
import * as api from "./getTasks";

// from Options
export const useTasks = ({
  filters,
  deps,
  enabled,
}: { filters: TaskFilters; deps: unknown[]; enabled: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.TASKS, ...deps],
    queryFn: async () => await api.getTasksByParams(filters),
    enabled,
  });

// from Popup
export const useTasksCache = () => {
  // NOTE: 現状 ここでしか使ってない関数。共通関数化して良かったのだろうか…
  const [projectId] = storage.useFilteringProjectId_Suspended();
  if (projectId === undefined) throw new Error("projectId is undefined");
  const [filterByDueByToday] = storage.useFilterByDueByToday_Suspended();
  const [sectionId] = storage.useFilteringSectionId_Suspended();

  const [cache] = storage.useTasksCache_Suspended();

  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.TASKS, projectId, filterByDueByToday],
    queryFn: async () =>
      await api.getTasksByParams({ projectId, filterByDueByToday, sectionId }),
    placeholderData: (prevData) => (prevData ? undefined : cache),
  }) as UseQueryResult<Task[]>;
};
