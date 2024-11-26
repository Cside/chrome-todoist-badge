import type { ProjectId, Section } from "../../types";
import { ky } from "../ky";
import { getApiUrlForGetSections } from "./getUrlForGetSections";

export const getSections = async ({ projectId }: { projectId: ProjectId }) =>
  await ky.getCamelized<Section[]>(getApiUrlForGetSections({ projectId }));
