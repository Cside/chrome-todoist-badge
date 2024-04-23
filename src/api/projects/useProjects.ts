import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../getProjects";
import { QUERY_KEY_FOR } from "../queryKeys";

// from Options
export const useProjects = () =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.PROJECTS],
    queryFn: getProjects,
  });
