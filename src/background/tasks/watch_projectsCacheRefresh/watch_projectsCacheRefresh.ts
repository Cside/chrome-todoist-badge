import { label } from "../../../fn/label";
import { refreshProjectsCache_onProjectsUpdated } from "./refreshProjectsCache_onProjectsUpdated";
import { refreshProjectsCache_regularly } from "./refreshProjectsCache_regularly";

export const watch_projectsCacheRefresh = async () => {
  console.info(`${label("watch-projects-cache-refresh")} task start`);
  refreshProjectsCache_onProjectsUpdated();
  await refreshProjectsCache_regularly();
};
