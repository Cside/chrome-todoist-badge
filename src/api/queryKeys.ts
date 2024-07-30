// biome-ignore format:
export const QUERY_KEY_FOR = {
  API: {
    PROJECTS: "api:projects",
    SECTIONS: "api:sections",
    TASKS:    "api:tasks",
  },
  STORAGE: {
    CONFIG: {
      FILTER_BY: {
        PROJECT_ID:   "config:filterBy:projectId",
        DUE_BY_TODAY: "config:filterBy:dueByToday",
      },
      FILTERS:        "config:filters",
      IS_INITIALIZED: "config:isInitialized",
    },
    CACHE: {
      TASKS: "cache:tasks",
    },
  },
};
