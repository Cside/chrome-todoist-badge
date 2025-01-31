import type {} from "../../../types";
import { addCommandListener } from "../fn/addCommandListener";
import * as api from "./fn/refreshSectionsCache";

// https://www.notion.so/97e7a56e72894496add5f649c56c78bd
const REGEXP = [
  // https://www.notion.so/97e7a56e72894496add5f649c56c78bd
  "^section_",
  "^project_delete$",
];

export const refreshSectionsCache_onSectionsUpdated = () =>
  addCommandListener({
    name: "refreshSectionsCache",
    commandRegExp: new RegExp(REGEXP.join("|")),
    listener: async () => await api.refreshSectionsCache(),
  });
