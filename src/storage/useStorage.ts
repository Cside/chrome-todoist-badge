import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { storage } from "wxt/storage";
import type { Task } from "../api/types";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import { STORAGE_KEY_FOR } from "./storageKeys";

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
    onMutationSuccess: async () =>
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
const useStorage_Suspended = <StorageValue = never>({
  storageKey,
  defaultValue,
  onMutationSuccess,
}: {
  storageKey: string;
  defaultValue?: StorageValue;
  onMutationSuccess?: () => Promise<void>;
}) => {
  const queryClient = useQueryClient();
  const queryKey = storageKey; // お行儀悪い気がするけど…。ズボラしちゃう。

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [queryKey] });
    if (onMutationSuccess) await onMutationSuccess();
  }, []);
  const mutate = useMutation({
    mutationFn: (value: StorageValue) => storage.setItem<StorageValue>(storageKey, value),
    onSuccess,
  }).mutate;
  const remove = useMutation({
    mutationFn: () => storage.removeItem(storageKey),
    onSuccess,
  }).mutate;

  return [
    useSuspenseQuery({
      queryKey: [queryKey],
      queryFn: async () => await storage.getItem<StorageValue>(storageKey),
    }).data ??
      defaultValue ??
      undefined,
    mutate,
    remove,
  ] as const;
};
