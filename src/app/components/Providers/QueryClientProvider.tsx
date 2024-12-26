import {
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
} from "@tanstack/react-query";
import { HTTPError } from "ky";
import type { ReactNode } from "react";
import { MAX_RETRIES } from "../../../constants/maxRetry";

// ky に揃える
// https://github.com/sindresorhus/ky/blob/3ba40cc6333cf1847c02c51744e22ab7c04407f5/source/utils/normalize.ts#L10
const RETRY_STATUS_CODES = [408, 413, 429, 500, 502, 503, 504];

const queryClient = new QueryClient({
  // Options: https://tanstack.com/query/latest/docs/reference/QueryClient
  defaultOptions: {
    mutations: {
      throwOnError: true,
      retry: MAX_RETRIES,
    },
    queries: {
      // https://github.com/TanStack/query/discussions/372#discussioncomment-7807126
      retry: (_failureCount, error) => {
        const failureCount = _failureCount + 1; // failureCount: 0 で始まるため

        if (failureCount > MAX_RETRIES) return false;

        if (
          error instanceof HTTPError &&
          !RETRY_STATUS_CODES.includes(error.response.status)
        ) {
          console.info(
            `Aborting retry due to status code: ${error.response.status}`,
          );
          return false;
        }
        console.info(`Retrying... failureCount: ${failureCount}`);
        return true;
      },
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
