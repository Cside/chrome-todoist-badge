import { Suspense } from "react";
import { Outlet, RouterProvider, createHashRouter, redirect } from "react-router-dom";
import { ErrorBoundary } from "./Providers/ErrorBoundary";
import { QueryClientProvider } from "./Providers/QueryClientProvider";
import { Spinner } from "./Spinner";

// sync import にしても初期描画速度遅くならないので。
// 逆に、dynamic import にすると、Spinner がしばらく表示されて体験が悪くなる。
import Options from "./Options";
import Popup_Suspended from "./Popup/Popup";
import { PopupLoader } from "./Popup/PopupLoader";

export const Router = () => (
  <RouterProvider
    router={createHashRouter([
      {
        path: "/",
        element: (
          // これはどうなんだろ...？
          // TQ 使わないなら無駄なわけだし…
          // かといって、Popup.tsx, Options.tsx それぞれで Provider で囲むのは
          // DRY じゃないし…( TQ 以外にも Provider が増えたら地獄)
          <QueryClientProvider>
            <Suspense fallback={<Spinner className="mt-12 ml-16" />}>
              <Outlet />
            </Suspense>
          </QueryClientProvider>
        ),
        children: [
          {
            index: true,
            loader: () => {
              switch (location.pathname) {
                case "/options.html":
                  // コンポーネントを直接 return すると、loader が実行されないため
                  return redirect("/options");
                case "/popup.html":
                  return redirect("/popup");
                default:
                  throw new Error(`Unknown pathname: ${location.pathname}`);
              }
            },
          },
          {
            path: "/options",
            element: <Options />,
          },
          {
            path: "/popup",
            loader: PopupLoader,
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
