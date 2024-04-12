import { Suspense } from "react";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import { QueryClientProvider } from "./QueryClientProvider";

export function AppWithProviders() {
  return (
    <ErrorBoundary>
      <QueryClientProvider>
        <Suspense fallback={<span className="loading loading-spinner loading-sm mt-12 ml-16" />}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
