import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOR } from "../app/constants/queryKeys";
import type { TasksFilters } from "../types";
import { getProjects, getTasks } from "./api";

export const useProjects_Suspended = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_PROJECTS],
    queryFn: getProjects,
  }).data;

// from Options
export const useTasks = ({ projectId, filterByDueByToday }: TasksFilters) =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_TASKS, projectId, filterByDueByToday],
    queryFn: async () => getTasks({ projectId, filterByDueByToday }),
  });
