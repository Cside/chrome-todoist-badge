import pRetry from "p-retry";
import { MAX_RETRY } from "../../constants/maxRetry";
import { API_URL_FOR } from "../../constants/urls";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import type { Project, ProjectId } from "../../types";
import { ky } from "../ky";

export const getProjects = async () =>
  await ky.getCamelized<Project[]>(API_URL_FOR.GET_PROJECTS);

// from BG worker
const getProjectFromCacheOrApi = async (id: ProjectId) => {
  const projectsCache = await storage.getItem<Project[]>(
    STORAGE_KEY_FOR.CACHE.PROJECTS,
  );
  if (projectsCache !== null) {
    const project = projectsCache.find((project) => project.id === id);
    if (project !== undefined) return project;
  }
  try {
    await pRetry(
      async () => {
        const projects = await getProjects();
        await storage.setItem<Project[]>(STORAGE_KEY_FOR.CACHE.PROJECTS, projects);
        const project = projects.find((project) => project.id === id);
        if (project !== undefined) return project;
        // API に存在しない project === 削除された project 。
        // cache からは削除しない
      },
      { retries: MAX_RETRY },
    );
  } catch (error) {}
};
