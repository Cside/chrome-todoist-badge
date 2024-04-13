import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "./components/Providers/QueryClientProvider";
import { Router } from "./components/Router";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

ReactDOM.createRoot(root).render(
  <QueryClientProvider>
    <Suspense fallback={<span className="loading loading-spinner loading-sm mt-12 ml-16" />}>
      <Router />
    </Suspense>
  </QueryClientProvider>,
);
