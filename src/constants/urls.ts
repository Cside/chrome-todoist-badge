export const API_BASE_URL = "https://api.todoist.com";
export const WEB_APP_BASE_URL = "https://app.todoist.com";

// ==================================================
// API
// ==================================================
const API_REST_BASE_URL = `${API_BASE_URL}/rest/v2`;
// biome-ignore format: for alignment
export const API_URL_FOR = {
  GET_PROJECTS: `${API_REST_BASE_URL}/projects`,
  GET_TASKS:    `${API_REST_BASE_URL}/tasks`,
};
export const API_URL_MATCH_PATTERN_FOR = {
  SYNC: `${WEB_APP_BASE_URL}/API/v*/sync*`,
};

// ==================================================
// Web App
// ==================================================
export const WEB_APP_URL_FOR = {
  HOME: `${WEB_APP_BASE_URL}/app/`,
  PROJECT_FOR: (projectId: string) => `${WEB_APP_BASE_URL}/app/project/${projectId}`,
};
