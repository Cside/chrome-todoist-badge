import * as api from "../../../../api/sections/getSections";
import { STORAGE_KEY_FOR } from "../../../../storage/storageKeys";
import type { ProjectId, Section } from "../../../../types";

// for bg worker
export const refreshSectionsCache_withRetry = async () => {
  const projectId = await storage.getItem<ProjectId>(
    STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
  );
  // 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
  if (projectId === null) throw new Error("projectId is null");

  const sections = await api.getSections({ projectId });
  // storage は実質失敗し得ないので、リトライはしない
  await storage.setItem<Section[]>(STORAGE_KEY_FOR.CACHE.SECTIONS, sections);
};
