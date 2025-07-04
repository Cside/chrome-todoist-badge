import * as api from "../../../../api/projects/getProjects";
import { STORAGE_KEY_FOR } from "../../../../storage/storageKeys";
import type { Api } from "../../../../types";

// for bg worker
export const refreshProjectsCache = async () => {
  const projects = await api.getProjects();
  // storage は実質失敗し得ないので、リトライはしない
  await storage.setItem<Api.Project[]>(STORAGE_KEY_FOR.CACHE.PROJECTS, projects);
};
