import { difference, uniq } from "es-toolkit/compat";
import type {
  Api,
  ProjectId,
  SectionId,
  TasksGroupedByProject,
  TasksGroupedBySection,
} from "../../../../types";

const undefinedKey = "undefined";
export const groupTasksBySection = ({
  tasks,
  sections,
}: { tasks: Api.Task[]; sections: Api.Project[] }): TasksGroupedBySection => {
  const sectionIdToSection = new Map(
    sections.map((section) => [section.id, section] as const),
  );

  const groupedTasks = tasks.reduce((acc: Record<SectionId, Api.Task[]>, task) => {
    const key = task.sectionId ?? undefinedKey;

    acc[key] ??= [];
    acc[key].push(task);

    return acc;
  }, {});

  const sortedKeys = Object.keys(groupedTasks).sort((a, b) =>
    a === undefinedKey
      ? -1
      : (sectionIdToSection.get(a)?.order ?? 0) -
        (sectionIdToSection.get(b)?.order ?? 0),
  );

  return sortedKeys.map((key) => ({
    section: key === undefinedKey ? undefined : sectionIdToSection.get(key),
    tasks: (groupedTasks[key] ?? []).sort((a, b) => a.order - b.order),
  }));
};

// TODO 共通化、テスト
export const groupTasksByProject = ({
  tasks,
  projects,
}: { tasks: Api.Task[]; projects: Api.Project[] }): TasksGroupedByProject => {
  const projectIdToProject = new Map(
    projects.map((project) => [project.id, project] as const),
  );

  const groupedTasks = tasks.reduce((acc: Record<ProjectId, Api.Task[]>, task) => {
    const key = task.projectId;

    acc[key] ??= [];
    acc[key].push(task);

    return acc;
  }, {});

  const sortedKeys = Object.keys(groupedTasks).sort(
    (a, b) =>
      (projectIdToProject.get(a)?.order ?? 0) -
      (projectIdToProject.get(b)?.order ?? 0),
  );

  return sortedKeys.map((key) => ({
    project: projectIdToProject.get(key) as Api.Project,
    tasks: (groupedTasks[key] ?? []).sort((a, b) => a.order - b.order),
  }));
};

export const getUnknownSections = ({
  tasks,
  sections,
}: { tasks: Api.Task[]; sections: Api.Project[] }) => {
  const notIncluded = difference(
    tasks.map((task) => task.sectionId).filter((id) => id !== undefined) as string[],
    sections.map((section) => section.id),
  );
  return [
    notIncluded.length > 0,
    JSON.stringify(
      {
        notIncluded,
        tasksIds: uniq(tasks.map((task) => task.sectionId).sort()),
        sectionIds: uniq(sections.map((section) => section.id).sort()),
      },
      null,
      2,
    ),
  ] as const;
};

export const getUnknownProjects = ({
  tasks,
  projects,
}: { tasks: Api.Task[]; projects: Api.Project[] }) => {
  const notIncluded = difference(
    tasks.map((task) => task.projectId),
    projects.map((project) => project.id),
  );
  return [
    notIncluded.length > 0,
    JSON.stringify(
      {
        notIncluded,
        tasksIds: uniq(tasks.map((task) => task.projectId).sort()),
        projectIds: uniq(projects.map((project) => project.id).sort()),
      },
      null,
      2,
    ),
  ] as const;
};
