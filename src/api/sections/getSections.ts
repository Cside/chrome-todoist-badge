import type { Api, ProjectId } from "../../types";
import { ky } from "../ky";
import { getApiUrlForGetSections } from "./getUrlForGetSections";

export const getSections = async ({ projectId }: { projectId: ProjectId }) =>
  await ky.fetchAndNormalize<Api.Section[]>(getApiUrlForGetSections({ projectId }));
