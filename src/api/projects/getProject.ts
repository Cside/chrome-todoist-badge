import type { Project, ProjectId } from "../../types";
import { ky } from "../ky";

export const getProject = async (projectId: ProjectId) =>
  await ky.fetchAndNormalize<Project>(`/projects/${projectId}`);
