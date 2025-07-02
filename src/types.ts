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
    order: number;
  };

  export type Task = {
    id: TaskId;
    order: number;
    content: string;
    projectId: ProjectId;
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
  section: Api.Project | undefined;
  tasks: Api.Task[];
}[];

export type TasksGroupedByProject = {
  project: Api.Project;
  tasks: Api.Task[];
}[];
