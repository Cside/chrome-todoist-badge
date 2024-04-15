import { MAX_RETRY } from "@/src/constants/maxRetry";
import { QueryClient, QueryClientProvider as _QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  // https://tanstack.com/query/latest/docs/reference/QueryClient
  defaultOptions: {
    mutations: {
      throwOnError: true,
      retry: MAX_RETRY,
    },
    queries: {
      retry: MAX_RETRY,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
      throwOnError: true,
      networkMode: "always", // ネットワークに繋がってないとき用の案内を出すのもだるいので
    },
  },
});

export const QueryClientProvider = ({ children }: { children: ReactNode }) => (
  <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>
);
