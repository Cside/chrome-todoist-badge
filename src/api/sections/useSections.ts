import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOR } from "../queryKeys";
import { getSections } from "./getSections";

// from Popup
export const useSections = ({ projectId }: { projectId: string | undefined }) =>
  useQuery({
    queryKey: [QUERY_KEY_FOR.API.SECTIONS, projectId],
    queryFn: async () => {
      if (projectId === undefined) throw new Error("projectId is undefined");
      return await getSections({ projectId });
    },
    enabled: projectId !== undefined,
  });
