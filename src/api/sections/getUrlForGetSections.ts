import type { ProjectId } from "../../types";

export const getApiUrlForGetSections = ({ projectId }: { projectId: ProjectId }) =>
  `/sections?${new URLSearchParams({ project_id: projectId })}`;
