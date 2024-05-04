import type { ProjectId } from "../types";

// biome-ignore format:
export const API_BASE_URL     = "https://api.todoist.com";
export const WEB_APP_BASE_URL = "https://app.todoist.com";

// ==================================================
// API
// ==================================================
export const API_REST_BASE_URL = `${API_BASE_URL}/rest/v2`;

// biome-ignore format:
export const API_URL_FOR = {
  GET_PROJECTS: `${API_REST_BASE_URL}/projects`,
  GET_TASKS:    `${API_REST_BASE_URL}/tasks`,
  GET_SECTIONS_BY: (projectId:ProjectId) => `${API_REST_BASE_URL}/sections?${new URLSearchParams({ project_id: projectId })}`,
};

export const API_URL_MATCH_PATTERN_FOR = {
  SYNC: `${WEB_APP_BASE_URL}/api/v*/sync*`,
};

// ==================================================
// Web App
// ==================================================
export const WEB_APP_URL_FOR = {
  PROJECT_BY: (projectId: ProjectId) => `${WEB_APP_BASE_URL}/app/project/${projectId}`,
  LOGIN: `${WEB_APP_BASE_URL}/auth/login`,
};
