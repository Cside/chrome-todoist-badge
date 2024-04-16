import { type UseQueryResult, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOR } from "../app/constants/queryKeys";
import type { TaskFilters } from "../types";
import * as storage from "../useStorage";
import { getProjects, getTasksByParams } from "./api";
import type { Task } from "./types";

export const useProjects_Suspended = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_PROJECTS],
    queryFn: getProjects,
  }).data;

// from Options
export const useTasks = ({ projectId, filterByDueByToday }: TaskFilters) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_TASKS, projectId, filterByDueByToday],
    queryFn: async () => await getTasksByParams({ projectId, filterByDueByToday }),
  });
};

// for Popup
export const useTasks_Suspended = () => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  const [filterByDueByToday] = storage.useFilterByDueByToday_Suspended();
  const [cache] = storage.useCachedTasks_Suspended();

  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_TASKS, projectId, filterByDueByToday],
    queryFn: async () => await getTasksByParams({ projectId, filterByDueByToday }),
    placeholderData: (prevData) => (prevData ? undefined : cache),
  }) as UseQueryResult<Task[]>;
};
