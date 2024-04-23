// biome-ignore format:
export const QUERY_KEY_FOR = {
  API: {
    GET_PROJECTS: "api:projects",
    GET_SECTIONS: "api:sections",
    GET_TASKS:    "api:tasks",
  },
  STORAGE: {
    CONFIG: {
      FILTER_BY: {
        PROJECT_ID:   "config:filterBy:projectId",
        DUE_BY_TODAY: "config:filterBy:dueByToday",
      },
      IS_INITIALIZED: "config:isInitialized",
    },
    CACHE: {
      TASKS: "cache:tasks",
    },
  },
};
