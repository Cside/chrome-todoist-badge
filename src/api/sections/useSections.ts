import { useQuery } from "@tanstack/react-query";
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
      return await api.getSections({ projectId });
    },
    ...(cache && {
      placeholderData: (prevData) => (prevData ? undefined : cache),
    }),
    enabled: projectId !== undefined,
  });
};

// from Popup
export const useSectionsCache = ({ isCacheAvailable }: { isCacheAvailable: boolean }) => {
  const cache = storage.useCachedSections_Suspended();
  return useSections({ cache: isCacheAvailable ? cache : undefined });
};
