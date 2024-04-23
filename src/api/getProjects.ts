import { API_URL_FOR } from "../constants/urls";
import { kyInstance } from "./kyInstance";
import type { Project } from "./types";

export const getProjects = async () => {
  const projects: Project[] = await kyInstance.get(API_URL_FOR.GET_PROJECTS).json();
  return projects;
};
