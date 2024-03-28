import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_OF } from "../popup/constants/queryKeys";
import type { GetTasksParams } from "../types";
import { getProjects, getTasksCount } from "./api";

export const useSuspenseProjects = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.PROJECTS],
    queryFn: getProjects,
  });

// ========================================
// Tasks Count
// ========================================
export const useTasksCount = ({ projectId, filterByDueByToday }: GetTasksParams) =>
  useQuery({
    queryKey: [QUERY_KEY_OF.TASKS, projectId, filterByDueByToday],
    queryFn: async () => getTasksCount({ projectId, filterByDueByToday }),
  });
