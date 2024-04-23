import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOR } from "../queryKeys";
import { getProjects } from "./getProjects";

// from Options
export const useProjects = () =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.PROJECTS],
    queryFn: getProjects,
  });
