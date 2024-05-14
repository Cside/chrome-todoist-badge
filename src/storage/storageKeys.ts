export const STORAGE_KEY_FOR = {
  CONFIG: {
    // biome-ignore format:
    FILTER_BY: {
      PROJECT_ID:   "local:config:filterBy:projectId",
      DUE_BY_TODAY: "local:config:filterBy:dueByToday",
      SECTION_ID:   "local:config:filterBy:sectionId",
    },
    IS_INITIALIZED: "local:config:isInitialized",
  },
  // biome-ignore format:
  CACHE: {
    PROJECTS: "local:cache:projects",
    SECTIONS: "local:cache:sections",
    TASKS:    "local:cache:tasks",
    /*         | popup | options | background fetch
      ---------|-------|---------|------------------
      projects |       |         | o
      sections | o     |         | o
      tasks    | o     |         | o
    */
  },
};
