// TODO: ファイル名がイマイチだな。。

// initial でもあり、default でもある気がする…
export const DEFAULT_FILTER_BY_DUE_BY_TODAY = false;
export const DEFAULT_IS_CONFIG_INITIALIZED = false;

// storage への保存のために便宜的に使う ID 。
// Storage に「 sectionId: !/* 」とかあっても、何のこっちゃ分からんので。。
export const SECTION_ID_FOR_STORAGE = {
  // biome-ignore format:
  ALL:       "__all", // storage には保存しない。Options.tsx でのみ使う。undefined は disabled を選択状態にすることができないため
  NO_PARENT: "__no-parent",
} as const;

export const SECTION_ID_TO_FILTER = {
  NO_PARENT: "!/*",
} as const;
