import { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { QueryClientProvider } from "./QueryClientProvider";

export const Providers = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <QueryClientProvider>
      <Suspense fallback={<span className="loading loading-spinner loading-sm mt-12 ml-16" />}>
        {children}
      </Suspense>
    </QueryClientProvider>
  </ErrorBoundary>
);
