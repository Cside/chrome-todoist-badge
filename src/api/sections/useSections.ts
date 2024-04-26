import * as storage from "@/src/storage/useStorage";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOR } from "../queryKeys";
import * as api from "./getSections";

// from Options
export const useSections = () => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  return useQuery({
    queryKey: [QUERY_KEY_FOR.API.SECTIONS, projectId],
    queryFn: async () => {
      if (projectId === undefined) throw new Error("projectId is undefined");
      return await api.getSections({ projectId });
    },
    enabled: projectId !== undefined,
  });
};

// from Popup
export const useSectionsCache = () => {};
