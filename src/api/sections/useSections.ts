import { useQuery } from "@tanstack/react-query";
import { storage as wxtStorage } from "wxt/storage";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import * as storage from "../../storage/useStorage";
import type { Section } from "../../types";
import { QUERY_KEY_FOR } from "../queryKeys";
import * as api from "./getSections";

// from Options
export const useSections = ({ cache }: { cache?: Section[] | undefined } = {}) => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.SECTIONS, projectId],
    queryFn: async () => {
      if (projectId === undefined) throw new Error("projectId is undefined");
      const sections = await api.getSections({ projectId });
      await wxtStorage.setItem<Section[]>(STORAGE_KEY_FOR.CACHE.SECTIONS, sections); // retry はサボる
      return sections;
    },
    ...(cache && {
      placeholderData: (prevData: Section[] | undefined) =>
        prevData !== undefined ? undefined : cache,
    }),
    enabled: projectId !== undefined,
  });
};

// from Popup
export const useSectionsCache = ({
  isCacheAvailable,
}: { isCacheAvailable: boolean }) => {
  const cache = storage.useSectionsCache_Suspended();
  return useSections({ cache: isCacheAvailable ? cache : undefined });
};
