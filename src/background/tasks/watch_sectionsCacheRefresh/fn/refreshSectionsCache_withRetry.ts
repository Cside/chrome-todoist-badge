import pRetry from "p-retry";
import * as api from "../../../../api/sections/getSections";
import { MAX_RETRY } from "../../../../constants/maxRetry";
import { STORAGE_KEY_FOR } from "../../../../storage/storageKeys";
import type { ProjectId, Section } from "../../../../types";

// for bg worker
export const refreshSectionsCache_withRetry = async () =>
  await pRetry(
    async () => {
      const projectId = await storage.getItem<ProjectId>(
        STORAGE_KEY_FOR.CONFIG.FILTER_BY.PROJECT_ID,
      );
      // 初期化が終わった後に呼ばれる前提の関数なので、projectId == null の場合はエラーにしている
      if (projectId === null) throw new Error("projectId is null");

      const sections = await api.getSections({ projectId });
      await storage.setItem<Section[]>(STORAGE_KEY_FOR.CACHE.SECTIONS, sections);
    },
    { retries: MAX_RETRY },
  );
