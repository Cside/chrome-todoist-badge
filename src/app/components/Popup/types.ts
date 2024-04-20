import type { SectionId, Task } from "@/src/api/types";

export type TasksGroupedBySection = {
  sectionId: SectionId;
  tasks: Task[];
}[];
