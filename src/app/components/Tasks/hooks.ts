import { WEB_APP_URL_FOR } from "../../../constants/urls";
import { ProjectIdNotFoundError } from "../../../errors";
import * as storage from "../../../storage/useStorage";

// 初期化が終わってないと Options.tsx にリダイレクトするので
// projectId がある前提の作りにする。

export const useWebAppUrl = () => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  if (projectId === undefined)
    throw new ProjectIdNotFoundError("projectId is undefined");

  return WEB_APP_URL_FOR.PROJECT_BY(projectId);
};
