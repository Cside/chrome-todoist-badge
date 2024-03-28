import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { storage } from "wxt/storage";
import { STORAGE_KEY_OF } from "./constants/storageKeys";
import { QUERY_KEY_OF } from "./popup/constantas/queryKeys";

// ========================================
// FilteringProjectId
// ========================================
export const useSuspenseFilteringProjectId = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.FILTERING_PROJECT_ID],
    queryFn: async () => storage.getItem<string>(STORAGE_KEY_OF.FILTERING_PROJECT_ID),
  }).data ?? undefined;

export const useFilteringProjectIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string | undefined) =>
      projectId === undefined
        ? storage.removeItem(STORAGE_KEY_OF.FILTERING_PROJECT_ID)
        : storage.setItem<string>(STORAGE_KEY_OF.FILTERING_PROJECT_ID, projectId),
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
  }).data ?? undefined;

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
