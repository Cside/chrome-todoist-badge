import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { ErrorBoundary } from "./Providers/ErrorBoundary";

const Options = React.lazy(() => import("./Options"));
const Popup = React.lazy(() => import("./Popup"));

export const Router = () => (
  <RouterProvider
    router={createHashRouter([
      {
        path: "/",
        children: [
          {
            path: "/",
            element: (() => {
              switch (location.pathname) {
                case "/options.html":
                  return <Options />;
                case "/popup.html":
                  return <Popup />;
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
            element: <Popup />,
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
