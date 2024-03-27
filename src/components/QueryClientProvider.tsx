import { QueryClient, QueryClientProvider as _QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  // https://tanstack.com/query/latest/docs/reference/QueryClient
  defaultOptions: {
    queries: {
      // retry: 3,
      retry: 1, // FIXME
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
