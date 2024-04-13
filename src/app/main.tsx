import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "./components/Providers/QueryClientProvider";
import { Router } from "./components/Router";
import { Spinner } from "./components/Spinner";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

ReactDOM.createRoot(root).render(
  <QueryClientProvider>
    <Suspense fallback={<Spinner className="mt-12 ml-16" />}>
      <Router />
    </Suspense>
  </QueryClientProvider>,
);
