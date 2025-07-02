import { useQuery } from "@tanstack/react-query";
import { storage as wxtStorage } from "wxt/storage";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import * as storage from "../../storage/useStorage";
import type { Api } from "../../types";
import { QUERY_KEY_FOR } from "../queryKeys";
import * as api from "./getProjects";

// from Options
export const useProjects = ({
  cache,
  enabled = true,
}: { cache?: Api.Project[] | undefined; enabled?: boolean } = {}) =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.PROJECTS],
    queryFn: async () => {
      const projects = await api.getProjects();
      await wxtStorage.setItem<Api.Project[]>(
        // TODO: useMutation 使わなくて良いんだっけ？
        STORAGE_KEY_FOR.CACHE.PROJECTS,
        projects,
      ); // retry はサボる
      return projects;
    },
    ...(cache && {
      placeholderData: (prevData: Api.Project[] | undefined) =>
        prevData !== undefined ? undefined : cache,
    }),
    enabled,
  });

// from Tasks
export const useCachedProjects = ({
  isCacheAvailable,
  enabled,
}: { isCacheAvailable: boolean; enabled: boolean }) => {
  const cache = storage.useCachedProjects_Suspended();
  return useProjects({ cache: isCacheAvailable ? cache : undefined, enabled });
};
