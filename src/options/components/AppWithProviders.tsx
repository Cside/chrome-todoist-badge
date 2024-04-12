import { Suspense } from "react";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import { QueryClientProvider } from "./QueryClientProvider";

export function AppWithProviders() {
  return (
    <ErrorBoundary>
      <QueryClientProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
