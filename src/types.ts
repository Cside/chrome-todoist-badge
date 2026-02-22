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
    childOrder: number;
  };

  export type Task = {
    id: TaskId;
    childOrder: number;
    content: string;
    projectId: ProjectId;
    sectionId: SectionId | undefined;
    url: string;
  };

  export type Section = {
    id: SectionId;
    name: string;
    sectionOrder: number;
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

export type TasksGroupedByProject = {
  project: Api.Project;
  tasks: Api.Task[];
}[];
