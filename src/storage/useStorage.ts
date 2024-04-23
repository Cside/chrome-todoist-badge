import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { storage } from "wxt/storage";
import type { Task } from "../api/types";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import { STORAGE_KEY_FOR } from "./queryKeys";

export const useFilteringProjectId_Suspended = () =>
  useStorage_Suspended<string>({
    storageKey: STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
  });

export const useFilterByDueByToday_Suspended = () => {
  const [filterByDueByToday = DEFAULT_FILTER_BY_DUE_BY_TODAY, mutateFilterByDueByToday] =
    useStorage_Suspended<boolean>({
      storageKey: STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY,
      defaultValue: DEFAULT_FILTER_BY_DUE_BY_TODAY,
    });
  return [filterByDueByToday, mutateFilterByDueByToday] as const;
};

export const useFilteringSectionId_Suspended = () =>
  useStorage_Suspended<string>({
    storageKey: STORAGE_KEY_FOR.CONFIG.FILTER_BY.SECTION_ID,
  });

export const useIsConfigInitialized_Suspended = () =>
  useStorage_Suspended<boolean>({
    storageKey: STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED,
    defaultValue: false,
    onSuccess: async () =>
      await chrome.runtime.sendMessage({ action: "activate-badge-count-updates" }),
  });

export const useCachedTasks_Suspended = () =>
  useStorage_Suspended<Task[]>({
    storageKey: STORAGE_KEY_FOR.CACHE.TASKS,
  });

// ==================================================
// Utils
// ==================================================

// storage への insert は一瞬なので、useMutation の isLoading とかは今は扱わない
const useStorage_Suspended = <StorageType = never>({
  storageKey,
  defaultValue,
  onSuccess,
}: {
  storageKey: string;
  defaultValue?: StorageType;
  onSuccess?: () => Promise<void>;
}) => {
  const queryClient = useQueryClient();
  const queryKey = storageKey; // お行儀悪い気がするけど…。ズボラしちゃう。

  return [
    useSuspenseQuery({
      queryKey: [queryKey],
      queryFn: async () => await storage.getItem<StorageType>(storageKey),
    }).data ??
      defaultValue ??
      undefined,
    useMutation({
      mutationFn: (value: StorageType) => storage.setItem<StorageType>(storageKey, value),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [queryKey] });
        if (onSuccess) await onSuccess();
      },
    }).mutate,
  ] as const;
};
