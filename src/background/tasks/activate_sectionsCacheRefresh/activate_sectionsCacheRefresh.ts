import { refreshSectionsCache_onSectionsUpdated } from "./refreshSectionsCache_onSectionsUpdated";
import { refreshSectionsCache_regularly } from "./refreshSectionsCache_regularly";

export const activate_sectionsCacheRefresh = async () => {
  console.log(`[task start] ${activate_sectionsCacheRefresh.name}`);
  refreshSectionsCache_onSectionsUpdated();
  await refreshSectionsCache_regularly();
};
