import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { storage } from "wxt/storage";
import {
  DEFAULT_FILTER_BY_DUE_BY_TODAY,
  DEFAULT_IS_CONFIG_INITIALIZED,
} from "../constants/options";
import type { Api, ProjectId, SectionId } from "../types";
import { STORAGE_KEY_FOR } from "./storageKeys";

export const useFilteringProjectId_Suspended = () => {
  const key = STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID;
  const results = useStorage_Suspended<ProjectId>({ storageKey: key });

  return results;
};

export const useFilteringSectionId_Suspended = () => {
  const key = STORAGE_KEY_FOR.CONFIG.FILTER_BY.SECTION_ID;
  const results = useStorage_Suspended<SectionId>({ storageKey: key });

  return results;
};

export const useFilterByDueByToday_Suspended = () => {
  const [value = DEFAULT_FILTER_BY_DUE_BY_TODAY, mutate] =
    useStorage_Suspended<boolean>({
      storageKey: STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY,
      defaultValue: DEFAULT_FILTER_BY_DUE_BY_TODAY,
    });
  return [value, mutate] as const;
};

export const useIsConfigInitialized_Suspended = () => {
  const [value = DEFAULT_IS_CONFIG_INITIALIZED, mutate] =
    useStorage_Suspended<boolean>({
      storageKey: STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED,
      defaultValue: false,
      onMutationSuccess: async () =>
        await Promise.all([
          // TODO: 本来なら、ここ全体を pRetry で囲むべきかねぇ⋯
          chrome.runtime.sendMessage({
            action: "watch-tasks-cache-refresh-and-badge-count-updates",
          }),
          chrome.runtime.sendMessage({
            action: "watch-sections-cache-refresh",
          }),
        ]),
    });
  return [value, mutate] as const;
};

export const useCachedTasks_Suspended = () =>
  useStorage_Suspended<Api.Task[]>({
    storageKey: STORAGE_KEY_FOR.CACHE.TASKS,
  });

export const useCachedSections_Suspended = () =>
  // Mutation 使わないので素の useSuspenseQuery
  useSuspenseQuery({
    queryKey: [STORAGE_KEY_FOR.CACHE.SECTIONS],
    queryFn: async () =>
      await storage.getItem<Api.Section[]>(STORAGE_KEY_FOR.CACHE.SECTIONS),
  }).data ?? undefined;

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
  onMutationSuccess?: () => Promise<unknown>;
}) => {
  const queryClient = useQueryClient();
  const queryKey = storageKey; // お行儀悪い気がするけど…。ズボラしちゃう。

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [queryKey] });
    if (onMutationSuccess) await onMutationSuccess();
  }, []);
  const mutate = useMutation({
    mutationFn: (value: StorageValue) =>
      storage.setItem<StorageValue>(storageKey, value),
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
