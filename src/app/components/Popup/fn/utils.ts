import { difference } from "lodash-es";
import type {
  Section,
  SectionId,
  Task,
  TasksGroupedBySection,
} from "../../../../types";

const undefinedKey = "undefined";
export const groupTasksBySectionId = ({
  tasks,
  sections,
}: { tasks: Task[]; sections: Section[] }): TasksGroupedBySection => {
  const sectionIdToSection = new Map(
    sections.map((section) => [section.id, section] as const),
  );

  const grouped = tasks.reduce((acc: Record<SectionId, Task[]>, task) => {
    const key = task.sectionId ?? undefinedKey;

    acc[key] ??= [];
    acc[key]?.push(task);

    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort((a, b) =>
    a === undefinedKey
      ? -1
      : (sectionIdToSection.get(a)?.order ?? 0) -
        (sectionIdToSection.get(b)?.order ?? 0),
  );

  return sortedKeys.map((key) => ({
    section:
      key === undefinedKey
        ? undefined
        : sectionIdToSection.get(key) ??
          (() => {
            throw new Error(`section was not found. id: ${key}`);
          })(),
    tasks: (grouped[key] ?? []).sort((a, b) => a.order - b.order),
  }));
};

export const getUnknownSectionIds = ({
  tasks,
  sections,
}: { tasks: Task[]; sections: Section[] }) =>
  difference(
    tasks
      .map((task) => task.sectionId)
      .filter((id) => id !== undefined) as string[],
    sections.map((section) => section.id),
  );
