import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useCallback } from "react";
import useAsyncEffect from "use-async-effect";
import { storage } from "wxt/storage";
import { getProject } from "../api/projects/getProject";
import { getSection } from "../api/sections/getSection";
import {
  DEFAULT_FILTER_BY_DUE_BY_TODAY,
  DEFAULT_IS_CONFIG_INITIALIZED,
} from "../constants/options";
import type { ProjectId, Section, SectionId, Task } from "../types";
import { STORAGE_KEY_FOR } from "./storageKeys";

const projectIdHasChecked = new Map<ProjectId, true>();

export const useFilteringProjectId_Suspended = () => {
  const queryClient = useQueryClient();
  const key = STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID;
  const results = useStorage_Suspended<ProjectId>({ storageKey: key });
  const [projectId] = results;

  // 共通化してない
  useAsyncEffect(async () => {
    if (projectIdHasChecked.has(key)) return;
    projectIdHasChecked.set(key, true);

    try {
      if (projectId !== undefined) await getProject(projectId);
    } catch (error) {
      if (error instanceof HTTPError && String(error.response.status).startsWith("4")) {
        console.warn(`Invalidate project: ${projectId}, status code: ${error.response.status}`);
        await Promise.all([
          storage.removeItem(key),
          queryClient.invalidateQueries({ queryKey: [key] }),
        ]);
      }
    }
  }, [projectId]);

  return results;
};

const sectionIdHasChecked = new Map<SectionId, true>();

export const useFilteringSectionId_Suspended = () => {
  const queryClient = useQueryClient();
  const key = STORAGE_KEY_FOR.CONFIG.FILTER_BY.SECTION_ID;
  const results = useStorage_Suspended<SectionId>({ storageKey: key });
  const [sectionId] = results;

  // 共通化してない
  useAsyncEffect(async () => {
    if (sectionIdHasChecked.has(key)) return;
    sectionIdHasChecked.set(key, true);

    try {
      if (sectionId !== undefined) await getSection(sectionId);
    } catch (error) {
      if (error instanceof HTTPError && String(error.response.status).startsWith("4")) {
        console.warn(`Invalidate section: ${sectionId}, status code: ${error.response.status}`);
        await Promise.all([
          storage.removeItem(key),
          queryClient.invalidateQueries({ queryKey: [key] }),
        ]);
      }
    }
  }, [sectionId]);

  return results;
};

export const useFilterByDueByToday_Suspended = () => {
  const [value = DEFAULT_FILTER_BY_DUE_BY_TODAY, mutate] = useStorage_Suspended<boolean>({
    storageKey: STORAGE_KEY_FOR.CONFIG.FILTER_BY.DUE_BY_TODAY,
    defaultValue: DEFAULT_FILTER_BY_DUE_BY_TODAY,
  });
  return [value, mutate] as const;
};

export const useIsConfigInitialized_Suspended = () => {
  const [value = DEFAULT_IS_CONFIG_INITIALIZED, mutate] = useStorage_Suspended<boolean>({
    storageKey: STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED,
    defaultValue: false,
    onMutationSuccess: async () =>
      await Promise.all([
        chrome.runtime.sendMessage({
          action: "activate-tasks-cache-refresh-and-badge-count-updates",
        }),
        chrome.runtime.sendMessage({
          action: "activate-sections-cache-refresh",
        }),
      ]),
  });
  return [value, mutate] as const;
};

export const useTasksCache_Suspended = () =>
  useStorage_Suspended<Task[]>({
    storageKey: STORAGE_KEY_FOR.CACHE.TASKS,
  });

export const useCachedSections_Suspended = () =>
  // Mutation 使わないので素の useSuspenseQuery
  useSuspenseQuery({
    queryKey: [STORAGE_KEY_FOR.CACHE.SECTIONS],
    queryFn: async () => await storage.getItem<Section[]>(STORAGE_KEY_FOR.CACHE.SECTIONS),
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
