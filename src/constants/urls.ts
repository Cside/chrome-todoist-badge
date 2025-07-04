import type { ProjectId } from "../types";

// biome-ignore format:
export const API_BASE_URL     = "https://api.todoist.com";
export const WEB_APP_BASE_URL = "https://app.todoist.com";

// ==================================================
// API
// ==================================================
export const API_REST_BASE_URL = `${API_BASE_URL}/rest/v2`;

// biome-ignore format:
export const API_PATH_FOR = {
  GET_PROJECTS: "/projects",
  GET_TASKS:    "/tasks",
} as const;

export const API_URL_MATCH_PATTERN_FOR = {
  SYNC: `${WEB_APP_BASE_URL}/api/v*/sync*`,
} as const;

// ==================================================
// Web App
// ==================================================
export const WEB_APP_URL_FOR = {
  PROJECT_BY: (projectId: ProjectId) =>
    `${WEB_APP_BASE_URL}/app/project/${projectId}`,
  INBOX: `${WEB_APP_BASE_URL}/app/inbox`,
  LOGIN: `${WEB_APP_BASE_URL}/auth/login`,
} as const;
