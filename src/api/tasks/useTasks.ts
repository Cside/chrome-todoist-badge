import type { TaskFilters } from "@/src/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import * as storage from "../../storage/useStorage";
import { QUERY_KEY_FOR } from "../queryKeys";
import type { Task } from "../types";
import { getTasksByParams } from "./getTasks";

// from Options
export const useTasks = ({
  filters,
  deps,
  enabled,
}: { filters: TaskFilters; deps: unknown[]; enabled: boolean }) =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.TASKS, ...deps],
    queryFn: async () => await getTasksByParams(filters),
    enabled,
  });

// from Popup
export const useTasksWithCache = () => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  if (projectId === undefined) throw new Error("projectId is undefined");

  const [filterByDueByToday] = storage.useFilterByDueByToday_Suspended();
  const [sectionId] = storage.useFilteringSectionId_Suspended();
  const [cache] = storage.useCachedTasks_Suspended();

  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.TASKS, projectId, filterByDueByToday],
    queryFn: async () => await getTasksByParams({ projectId, filterByDueByToday, sectionId }),
    placeholderData: (prevData) => (prevData ? undefined : cache),
  }) as UseQueryResult<Task[]>;
};
