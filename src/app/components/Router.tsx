import { HASH_TO, PATH_TO } from "@/src/constants/paths";
import { Suspense } from "react";
import { Outlet, RouterProvider, createHashRouter, redirect } from "react-router-dom";
import Options from "./Options";
import PinExtensionToToolbar from "./PinExtensionToToolbar";
import Popup_Suspended from "./Popup/Popup";
import { PopupLoader } from "./Popup/PopupLoader";
import { ErrorBoundary } from "./Providers/ErrorBoundary";
import { QueryClientProvider } from "./Providers/QueryClientProvider";
import { Spinner } from "./Spinner";
import Welcome from "./Welcome";

// sync import にしても初期描画速度遅くならないので。
// 逆に、dynamic import にすると、Spinner がしばらく表示されて体験が悪くなる。

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
                case PATH_TO.OPTIONS:
                  // コンポーネントを直接 return すると、loader が実行されないため
                  return redirect(HASH_TO.OPTIONS);
                case PATH_TO.POPUP:
                  return redirect(HASH_TO.POPUP);
                default:
                  throw new Error(`Unknown pathname: ${location.pathname}`);
              }
            },
          },
          {
            path: HASH_TO.OPTIONS,
            element: <Options />,
          },
          {
            path: HASH_TO.POPUP,
            loader: PopupLoader,
            element: <Popup_Suspended />,
          },
          {
            path: HASH_TO.WELCOME,
            element: <Welcome />,
          },
          {
            path: HASH_TO.PIN_EXTENSION_TO_TOOLBAR,
            element: <PinExtensionToToolbar />,
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
