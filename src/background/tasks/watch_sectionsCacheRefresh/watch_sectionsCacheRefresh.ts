import { label } from "../../../fn/label";
import { refreshSectionsCache_onSectionsUpdated } from "./refreshSectionsCache_onSectionsUpdated";
import { refreshSectionsCache_regularly } from "./refreshSectionsCache_regularly";

export const watch_sectionsCacheRefresh = async () => {
  console.info(`${label(watch_sectionsCacheRefresh.name)} task start`);
  refreshSectionsCache_onSectionsUpdated();
  await refreshSectionsCache_regularly();
};
