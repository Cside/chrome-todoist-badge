import type { Api, ProjectId } from "../../types";
import { ky } from "../ky";

export const getProject = async (projectId: ProjectId) =>
  await ky.fetchAndNormalize<Api.Project>(`/projects/${projectId}`);
