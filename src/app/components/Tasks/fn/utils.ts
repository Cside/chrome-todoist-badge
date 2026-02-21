import {} from "es-toolkit/compat";
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
}: { tasks: Api.Task[]; sections: Api.Section[] }): TasksGroupedBySection => {
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

  return sortedKeys
    .map((key) => {
      const tasks = (groupedTasks[key] ?? []).sort((a, b) => a.order - b.order);
      if (key === undefinedKey) {
        return {
          section: undefined,
          tasks,
        };
      }
      const section = sectionIdToSection.get(key);
      if (!section) {
        console.warn(`Unknown sectionId: ${key}`); // API 側でキャッシュされている時
        return undefined;
      }

      return {
        section: key === undefinedKey ? undefined : section,
        tasks,
      };
    })
    .filter(Boolean);
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
      (projectIdToProject.get(a)?.childOrder ?? 0) -
      (projectIdToProject.get(b)?.childOrder ?? 0),
  );

  return sortedKeys
    .map((key) => {
      const project = projectIdToProject.get(key);
      if (!project) {
        console.warn(`Unknown projectId: ${key}`); // API 側でキャッシュされている時
        return undefined;
      }

      return {
        project,
        tasks: (groupedTasks[key] ?? []).sort((a, b) => a.order - b.order),
      };
    })
    .filter(Boolean);
};
