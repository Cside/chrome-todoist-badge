import { API_REST_BASE_URL } from "../../constants/urls";
import type { Project, ProjectId } from "../../types";
import { ky } from "../ky";

export const getProject = async (projectId: ProjectId) =>
  await ky.getCamelized<Project>(`${API_REST_BASE_URL}/projects/${projectId}`);
