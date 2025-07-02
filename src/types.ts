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

export type TaskForApi = {
  id: TaskId;
  order: number;
  content: string;
  sectionId: SectionIdOfTask;
  url: string;
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

export type TasksGroupedBySection = {
  section: Section | undefined;
  tasks: TaskForApi[];
}[];
