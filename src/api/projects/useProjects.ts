import { useSuspenseQuery } from "@tanstack/react-query";
import { getProjects } from "../getProjects";
import { QUERY_KEY_FOR } from "../queryKeys";

// from Options
export const useProjects_Suspended = () =>
  useSuspenseQuery({
    queryKey: [QUERY_KEY_FOR.API.GET_PROJECTS],
    queryFn: getProjects,
  }).data;
