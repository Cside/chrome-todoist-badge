// biome-ignore format: for alignment
export const QUERY_KEY_FOR = {
  API: {
    GET_TASKS:    "api:getTasks",
    GET_PROJECTS: "api:getProjects",
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
