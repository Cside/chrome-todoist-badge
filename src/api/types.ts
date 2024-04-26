// NOTE: types/api.ts と迷ってる。。
// TODO: ここではない気がする…。src/types.ts か src/types/* あたり？

export type Project = {
  id: string;
  name: string;
};

export type SectionIdOfTask = string | null;

export type Task = {
  id: string;
  content: string;
  sectionId: SectionIdOfTask;
};

export type Section = {
  id: string;
  name: string;
  order: number;
};
