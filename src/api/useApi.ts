import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_OF } from "../popup/constants/queryKeys";
import type { TasksFilters } from "../types";
import { getProjects, getTasksCount } from "./api";

export const useSuspenseProjects = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.API.GET_PROJECTS],
    queryFn: getProjects,
  }).data;

export const useTasksCount = ({ projectId, filterByDueByToday }: TasksFilters) =>
  useQuery({
    queryKey: [QUERY_KEY_OF.API.GET_TASKS, projectId, filterByDueByToday],
    queryFn: async () => getTasksCount({ projectId, filterByDueByToday }),
  });
