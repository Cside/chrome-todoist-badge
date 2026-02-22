import type { Api, ProjectId } from "../../types";
import { ky } from "../ky";
import { getApiUrlForGetSections } from "./getUrlForGetSections";

// TODO cursor... まぁ50件以上のsectionを持っている人は少ないと思うので、ひとまずは実装しない
export const getSections = async ({ projectId }: { projectId: ProjectId }) =>
  (
    await ky.fetchAndNormalize<{ results: Api.Section[] }>(
      getApiUrlForGetSections({ projectId }),
    )
  ).results;
