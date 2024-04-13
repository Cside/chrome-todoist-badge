import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOR } from "../options/constants/queryKeys";
import type { TasksFilters } from "../types";
import { getProjects, getTasks } from "./api";

export const useSuspenseProjects = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_PROJECTS],
    queryFn: getProjects,
  }).data;

export const useTasks = ({ projectId, filterByDueByToday }: TasksFilters) =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_TASKS, projectId, filterByDueByToday],
    queryFn: async () => getTasks({ projectId, filterByDueByToday }),
  });
