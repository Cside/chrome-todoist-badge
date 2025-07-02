// ==================================================
// API
// ==================================================
export type ProjectId = string;
export type SectionId = string;
type TaskId = string;

export namespace Api {
  export type Project = {
    id: ProjectId;
    name: string;
  };

  export type Task = {
    id: TaskId;
    order: number;
    content: string;
    sectionId: SectionId | undefined;
    url: string;
  };

  export type Section = {
    id: SectionId;
    name: string;
    order: number;
  };
}

// ==================================================
// Others
// ==================================================
export type TaskFilters = {
  projectId: ProjectId | undefined;
  filterByDueByToday: boolean;
  sectionId: SectionId | undefined;
};

export type TasksGroupedBySection = {
  section: Api.Section | undefined;
  tasks: Api.Task[];
}[];
