import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOR } from "../queryKeys";
import { getSections } from "./getSections";

const params = {
  queryKey: [QUERY_KEY_FOR.API.SECTIONS],
  queryFn: getSections,
};

// from Popup
export const useSections = () => useQuery(params);

// from Options
export const useSections_Suspended = () => useSuspenseQuery(params).data;
