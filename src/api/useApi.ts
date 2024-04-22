import { type UseQueryResult, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import * as storage from "../storage/useStorage";
import { getProjects, getTasksByParams } from "./api";
import { QUERY_KEY_FOR } from "./queryKeys";
import type { Task } from "./types";

export const useProjects_Suspended = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_PROJECTS],
    queryFn: getProjects,
  }).data;

// from Options
export const useTasks = ({
  projectId,
  filterByDueByToday,
}: { projectId: string; filterByDueByToday: boolean }) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_TASKS, projectId, filterByDueByToday],
    queryFn: async () => await getTasksByParams({ projectId, filterByDueByToday }),
  });
};

// for Popup
export const useTasks_Suspended = () => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  if (projectId === undefined) throw new Error("projectId is undefined");

  const [filterByDueByToday] = storage.useFilterByDueByToday_Suspended();
  const [cache] = storage.useCachedTasks_Suspended();

  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_TASKS, projectId, filterByDueByToday],
    queryFn: async () => await getTasksByParams({ projectId, filterByDueByToday }),
    placeholderData: (prevData) => (prevData ? undefined : cache),
  }) as UseQueryResult<Task[]>;
};
