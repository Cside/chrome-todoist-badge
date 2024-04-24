import { QUERY_KEY_FOR } from "@/src/api/queryKeys";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTaskFilters } from "./getTaskFilters";

// TODO: 現状 useTasksWithCache() でしか使ってない。共通関数化して良かったのだろうか…
export const useTaskFilters_Suspended = () =>
  useSuspenseQuery({ queryKey: [QUERY_KEY_FOR.STORAGE.CONFIG.FILTERS], queryFn: getTaskFilters })
    .data;
