import * as taskFilterStorage from "@/src/storage/taskFilters/useTaskFilters";
import type { TaskFilters } from "@/src/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import * as commonStorage from "../../storage/useStorage";
import { QUERY_KEY_FOR } from "../queryKeys";
import type { Task } from "../types";
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
export const useTasksWithCache = () => {
  // NOTE: 現状 ここでしか使ってない関数。共通関数化して良かったのだろうか…
  const { projectId, filterByDueByToday, sectionId } = storage.useTaskFilters_Suspended();
  const [cache] = storage.useCachedTasks_Suspended();

  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.TASKS, projectId, filterByDueByToday],
    queryFn: async () => await api.getTasksByParams({ projectId, filterByDueByToday, sectionId }),
    placeholderData: (prevData) => (prevData ? undefined : cache),
  }) as UseQueryResult<Task[]>;
};

const storage = {
  useCachedTasks_Suspended: commonStorage.useCachedTasks_Suspended,
  useTaskFilters_Suspended: taskFilterStorage.useTaskFilters_Suspended,
};
