import { difference } from "es-toolkit/compat";
import type {
  Section,
  SectionId,
  TaskForApi,
  TasksGroupedBySection,
} from "../../../../types";

const undefinedKey = "undefined";
export const groupTasksBySectionId = ({
  tasks,
  sections,
}: { tasks: TaskForApi[]; sections: Section[] }): TasksGroupedBySection => {
  const sectionIdToSection = new Map(
    sections.map((section) => [section.id, section] as const),
  );

  const groupedTasks = tasks.reduce((acc: Record<SectionId, TaskForApi[]>, task) => {
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

export const getUnknownSectionIds = ({
  tasks,
  sections,
}: { tasks: TaskForApi[]; sections: Section[] }) =>
  difference(
    tasks.map((task) => task.sectionId).filter((id) => id !== undefined) as string[],
    sections.map((section) => section.id),
  );
