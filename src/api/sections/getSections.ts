import { API_URL_FOR } from "../../constants/urls";
import type { ProjectId, Section } from "../../types";
import { ky } from "../ky";

export const getSections = async ({ projectId }: { projectId: ProjectId }) =>
  await ky.getCamelized<Section[]>(API_URL_FOR.GET_SECTIONS_BY(projectId));
