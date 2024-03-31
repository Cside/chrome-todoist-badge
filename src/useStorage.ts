import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { storage } from "wxt/storage";
import { STORAGE_KEY_OF } from "./constants/storageKeys";
import { QUERY_KEY_OF } from "./popup/constants/queryKeys";

// ========================================
// FilteringProjectId
// ========================================
const projectIdFn = storage.defineItem<string>(STORAGE_KEY_OF.CONFIG.FILTER_BY.PROJECT_ID);

export const useSuspenseFilteringProjectId = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.STORAGE.CONFIG.FILTER_BY.DUE_BY_TODAY],
    queryFn: async () => projectIdFn.getValue(),
  }).data ?? undefined;

export const useFilteringProjectIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string | undefined) =>
      projectId === undefined ? projectIdFn.removeValue() : projectIdFn.setValue(projectId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_OF.STORAGE.CONFIG.FILTER_BY.DUE_BY_TODAY],
      }),
  });
};

// ========================================
// FilterByDueByToday
// ========================================
const filterByDueByTodayFn = storage.defineItem<boolean>(
  STORAGE_KEY_OF.CONFIG.FILTER_BY.DUE_BY_TODAY,
);

export const useSuspenseFilterByDueByToday = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.STORAGE],
    queryFn: async () => filterByDueByTodayFn.getValue(),
  }).data ?? undefined;

export const useFilterByDueByTodayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (filterByDueByToday: boolean) =>
      filterByDueByTodayFn.setValue(filterByDueByToday),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_OF.STORAGE.CONFIG.FILTER_BY.DUE_BY_TODAY],
      }),
  });
};

// ========================================
// isInitialized
// ========================================
const isInitializedFn = storage.defineItem<boolean>(STORAGE_KEY_OF.CONFIG.IS_INITIALIZED);

export const useSuspenseIsInitialized = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_OF.STORAGE.CONFIG.IS_INITIALIZED],
    queryFn: async () => isInitializedFn.getValue(),
  }).data ?? undefined;

export const useIsInitializedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isInitialized: boolean) => isInitializedFn.setValue(isInitialized),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_OF.STORAGE.CONFIG.IS_INITIALIZED],
      }),
  });
};
