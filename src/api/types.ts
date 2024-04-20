// NOTE: types/api.ts と迷ってる。。

export type Project = {
  id: string;
  name: string;
};

export type SectionId = string | null;

export type Task = {
  id: string;
  content: string;
  sectionId: SectionId;
};
