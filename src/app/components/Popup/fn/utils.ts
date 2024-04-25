import type { Task } from "@/src/api/types";
import { WEB_APP_URL_FOR } from "@/src/constants/urls";
import * as storage from "../../../../storage/useStorage";
import type { TasksGroupedBySection } from "../types";

export const useWebAppUrl = () => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  if (projectId === undefined) throw new Error("projectId is undefined");

  return WEB_APP_URL_FOR.PROJECT_BY(projectId);
};

export const groupTasksBySectionId = (tasks: Task[]): TasksGroupedBySection => {
  const grouped = tasks.reduce((acc: Record<string, Task[]>, task) => {
    const key = task.sectionId ?? "null";
    let val = acc[key];
    if (!val) val = [];
    val.push(task);
    return acc;
  }, {});
  const sortedKeys = Object.keys(grouped).sort((a, b) => (a === "null" ? -1 : a.localeCompare(b)));

  return sortedKeys.map((key) => ({
    sectionId: key === "null" ? null : key,
    tasks: grouped[key] ?? [],
  }));
};
