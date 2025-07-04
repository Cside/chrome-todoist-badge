import * as api from "../../../../api/sections/getSections";
import { STORAGE_KEY_FOR } from "../../../../storage/storageKeys";
import type { Api, ProjectId } from "../../../../types";

// for bg worker
export const refreshSectionsCache = async () => {
  const projectId = await storage.getItem<ProjectId>(
    STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
  );
  if (projectId === null) return; // noop

  const sections = await api.getSections({ projectId });
  // storage は実質失敗し得ないので、リトライはしない
  await storage.setItem<Api.Section[]>(STORAGE_KEY_FOR.CACHE.SECTIONS, sections);
};
