import { Suspense } from "react";
import { Outlet, RouterProvider, createHashRouter } from "react-router-dom";
import { ErrorBoundary } from "./Providers/ErrorBoundary";
import { QueryClientProvider } from "./Providers/QueryClientProvider";
import { Spinner } from "./Spinner";

// sync import にしても初期描画速度遅くならないので。
// 逆に、dynamic import にすると、Spinner がしばらく表示されて体験が悪くなる。
import Options from "./Options";
import Popup_Suspended from "./Popup";

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
