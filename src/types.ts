// ==================================================
// API
// ==================================================
export type ProjectId = string;
export type SectionId = string;
type TaskId = string;

export type Project = {
  id: ProjectId;
  name: string;
};

type SectionIdOfTask = SectionId | undefined;

export type Task = {
  id: TaskId;
  order: number;
  content: string;
  sectionId: SectionIdOfTask;
};

export type Section = {
  id: SectionId;
  name: string;
  order: number;
};

// ==================================================
// Others
// ==================================================
export type TaskFilters = {
  projectId: ProjectId;
  filterByDueByToday: boolean;
  sectionId: SectionId | undefined;
};

export type SectionEntries = [SectionId, Section][];

export type TasksGroupedBySection = {
  section: Section | undefined;
  tasks: Task[];
}[];
