import type {} from "../../../types";
import { addCommandListener } from "../fn/addCommandListener";
import * as api from "./fn/refreshProjectsCache";

const REGEXP = [
  // https://www.notion.so/97e7a56e72894496add5f649c56c78bd
  "^projects_",
];

export const refreshProjectsCache_onProjectsUpdated = () =>
  addCommandListener({
    name: "refresh-projects-cache",
    commandRegExp: new RegExp(REGEXP.join("|")),
    listener: async () => await api.refreshProjectsCache(),
  });
