import { addCommandListener } from "../../fn/addCommandListener";
import * as api from "./fn/refreshTasksCache_andUpdateBadgeCount";

// https://www.notion.so/97e7a56e72894496add5f649c56c78bd
export const refreshTasksCache_andUpdateBadgeCount_onTaskUpdated = () =>
  addCommandListener(
    /^(item_|section_move$|section_delete$)/,
    async () =>
      await api.refreshTasksCache_andUpdateBadgeCount_withRetry({
        via: "on task updated on Todoist Web App",
      }),
  );
