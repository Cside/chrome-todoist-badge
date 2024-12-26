import type {} from "../../../types";
import { addCommandListener } from "../fn/addCommandListener";
import * as api from "./fn/refreshSectionsCache";

// https://www.notion.so/97e7a56e72894496add5f649c56c78bd
const REGEXP = /^section_/;

export const refreshSectionsCache_onSectionsUpdated = () =>
  addCommandListener({
    name: "refreshSectionsCache",
    commandRegExp: REGEXP,
    listener: async () => await api.refreshSectionsCache(),
  });
