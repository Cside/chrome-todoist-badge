import { label } from "../../../fn/label";
import { refreshSectionsCache_withRetry } from "./fn/refreshSectionsCache_withRetry";
import { refreshSectionsCache_onSectionsUpdated } from "./refreshSectionsCache_onSectionsUpdated";
import { refreshSectionsCache_regularly } from "./refreshSectionsCache_regularly";

export const activate_sectionsCacheRefresh = async () => {
  console.info(`${label("task start")} ${activate_sectionsCacheRefresh.name}`);
  refreshSectionsCache_onSectionsUpdated();
  await refreshSectionsCache_regularly();
  await refreshSectionsCache_withRetry();
};
