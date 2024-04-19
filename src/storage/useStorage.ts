import {
  type MutationFunction,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { storage } from "wxt/storage";
import { QUERY_KEY_FOR } from "../api/queryKeys";
import type { Task } from "../api/types";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import { STORAGE_KEY_FOR } from "./queryKeys";

export const useFilteringProjectId_Suspended = () =>
  useStorage_Suspended<string, string | undefined>({
    queryKey: QUERY_KEY_FOR.STORAGE.CONFIG.FILTER_BY.PROJECT_ID,
    storageKey: STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
    mutationFn: async (projectId: string | undefined) =>
      projectId === undefined
        ? storage.removeItem(STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID)
        : storage.setItem<string>(STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID, projectId),
  });

export const useFilterByDueByToday_Suspended = () => {
  const [filterByDueByToday = DEFAULT_FILTER_BY_DUE_BY_TODAY, mutateFilterByDueByToday] =
    useStorage_Suspended<boolean>({
      queryKey: QUERY_KEY_FOR.STORAGE.CONFIG.FILTER_BY.DUE_BY_TODAY,
      storageKey: STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY,
      defaultValue: DEFAULT_FILTER_BY_DUE_BY_TODAY,
    });
  return [filterByDueByToday, mutateFilterByDueByToday] as const;
};

export const useIsConfigInitialized_Suspended = () =>
  useStorage_Suspended<boolean>({
    queryKey: QUERY_KEY_FOR.STORAGE.CONFIG.IS_INITIALIZED,
    storageKey: STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED,
    defaultValue: false,
    onSuccess: async () =>
      await chrome.runtime.sendMessage({ action: "activate-badge-count-updates" }),
  });

export const useCachedTasks_Suspended = () =>
  useStorage_Suspended<Task[]>({
    queryKey: QUERY_KEY_FOR.STORAGE.CACHE.TASKS,
    storageKey: STORAGE_KEY_FOR.CACHE.TASKS,
  });

// ==================================================
// Utils
// ==================================================

// storage への insert は一瞬なので、useMutation の isLoading とかは今は扱わない
const useStorage_Suspended = <
  StorageType extends MutationType = never,
  MutationType = StorageType,
>({
  queryKey,
  storageKey,
  mutationFn = (async (value: StorageType) =>
    storage.setItem<StorageType>(storageKey, value)) as MutationFunction<void, MutationType>,
  defaultValue,
  onSuccess,
}: {
  queryKey: string;
  storageKey: string;
  mutationFn?: MutationFunction<void, MutationType>;
  defaultValue?: StorageType;
  onSuccess?: () => Promise<void>;
}) => {
  const queryClient = useQueryClient();

  return [
    useSuspenseQuery({
      queryKey: [queryKey],
      queryFn: async () => await storage.getItem<StorageType>(storageKey),
    }).data ??
      defaultValue ??
      undefined,
    useMutation({
      mutationFn,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [queryKey] });
        if (onSuccess) await onSuccess();
      },
    }).mutate,
  ] as const;
};