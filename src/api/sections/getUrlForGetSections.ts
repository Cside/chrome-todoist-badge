import { API_REST_BASE_URL } from "../../constants/urls";
import type { ProjectId } from "../../types";

export const getApiUrlForGetSections = ({ projectId }: { projectId: ProjectId }) =>
  `${API_REST_BASE_URL}/sections?${new URLSearchParams({ project_id: projectId })}`;
