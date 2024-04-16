import React, { Suspense } from "react";
import { Outlet, RouterProvider, createHashRouter } from "react-router-dom";
import { ErrorBoundary } from "./Providers/ErrorBoundary";
import { QueryClientProvider } from "./Providers/QueryClientProvider";
import { Spinner } from "./Spinner";

// const Popup_Suspended = React.lazy(() => import("./Popup"));
import Popup_Suspended from "./Popup";
const Options = React.lazy(() => import("./Options"));

export const Router = () => (
  <RouterProvider
    router={createHashRouter([
      {
        path: "/",
        element: (
          <QueryClientProvider>
            <Suspense fallback={<Spinner className="mt-12 ml-16" />}>
              <Outlet />
            </Suspense>
          </QueryClientProvider>
        ),
        children: [
          {
            index: true,
            element: (() => {
              switch (location.pathname) {
                case "/options.html":
                  return <Options />;
                case "/popup.html":
                  return <Popup_Suspended />;
                default:
                  throw new Error(`Unknown pathname: ${location.pathname}`);
              }
            })(),
          },
          {
            path: "/options",
            element: <Options />,
          },
          {
            path: "/popup",
            element: <Popup_Suspended />,
          },
          {
            path: "*",
            element: <div>Not Found</div>,
          },
        ],
        errorElement: <ErrorBoundary />,
      },
    ])}
  />
);
