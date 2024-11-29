import { API_URL_FOR } from "../../constants/urls";
import type { Project } from "../../types";
import { ky } from "../ky";
// import { STORAGE_KEY_FOR } from "../../storage/storageKeys";

export const getProjects = async () =>
  await ky.fetchAndNormalize<Project[]>(API_URL_FOR.GET_PROJECTS);

/* WIP
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
    const projects = await getProjects();
    await storage.setItem<Project[]>(STORAGE_KEY_FOR.CACHE.PROJECTS, projects);
    const project = projects.find((project) => project.id === id);
    if (project !== undefined) return project;
    // API に存在しない project === 削除された project 。
    // cache からは削除しない
  } catch (error) { ... }
};
*/
