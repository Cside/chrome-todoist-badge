import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { storage } from "wxt/storage";
import { getProjects } from "./api";

const QUERY_KEY_OF = {
  PROJECTS: "projects",
  FILTERING_PROJECT_ID: "filter:projectId",
  FILTER_BY_DUE_BY_TODAY: "filter:dueByToday",
};
// TODO: 置き場所、ここじゃない感
const STORAGE_KEY_OF = {
  FILTERING_PROJECT_ID: "local:config:filter:projectId",
  FILTER_DUE_BY_TODAY: "local:config:filter:dueByToday",
};

export const useSuspenseProjects = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.PROJECTS],
    queryFn: getProjects,
  });

// ========================================
// FilteringProjectId
// ========================================
export const useSuspenseFilteringProjectId = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.FILTERING_PROJECT_ID],
    queryFn: async () => storage.getItem<string>(STORAGE_KEY_OF.FILTERING_PROJECT_ID),
  });

export const useFilteringProjectIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) =>
      storage.setItem<string>(STORAGE_KEY_OF.FILTERING_PROJECT_ID, projectId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_OF.FILTERING_PROJECT_ID],
      }),
  });
};

// ========================================
// FilterByDueByToday
// ========================================
export const useSuspenseFilterByDueByToday = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.FILTER_BY_DUE_BY_TODAY],
    queryFn: async () => storage.getItem<boolean>(STORAGE_KEY_OF.FILTER_DUE_BY_TODAY),
  });

export const useFilterByDueByTodayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (filterByDueByToday: boolean) =>
      storage.setItem<boolean>(STORAGE_KEY_OF.FILTER_DUE_BY_TODAY, filterByDueByToday),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_OF.FILTER_BY_DUE_BY_TODAY],
      }),
  });
};
