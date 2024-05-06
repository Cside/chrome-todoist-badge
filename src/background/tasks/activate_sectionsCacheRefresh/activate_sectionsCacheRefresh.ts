import { refreshSectionsCache_onSectionsUpdated } from "./refreshSectionsCache_onSectionsUpdated";
import { refreshSectionsCache_regularly } from "./refreshSectionsCache_regularly";

export const activate_sectionsCacheRefresh = async () => {
  refreshSectionsCache_onSectionsUpdated();
  await refreshSectionsCache_regularly();
};
