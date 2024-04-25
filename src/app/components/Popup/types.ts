import type { SectionIdOfTask, Task } from "@/src/api/types";

export type TasksGroupedBySection = {
  sectionId: SectionIdOfTask;
  tasks: Task[];
}[];
