// initial でもあり、default でもある気がする…
export const DEFAULT_FILTER_BY_DUE_BY_TODAY = false;
export const DEFAULT_IS_CONFIG_INITIALIZED = false;

export const SECTION_ID_FOR = {
  // biome-ignore format:
  ALL:       "__all", // storage には保存しない。Options.tsx でのみ使う。undefined は disabled を選択状態にすることができないため
  NO_PARENT: "__noParent",
};
