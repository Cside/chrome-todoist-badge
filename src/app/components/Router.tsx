import { Suspense, useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createHashRouter,
  redirect,
} from "react-router-dom";
import { name as TITLE } from "../../../package.json";
import { PATH_TO } from "../../constants/paths";
import { isPopup } from "../fn/isPopup";
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

const Container = () => {
  useEffect(() => {
    document.title = TITLE;
  }, []);

  return (
    <QueryClientProvider>
      <Suspense fallback={<Spinner className="mt-12 ml-16" />}>
        <Outlet />
      </Suspense>
    </QueryClientProvider>
  );
};

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
          <Container />
        ),
        children: [
          {
            index: true,
            loader: () => redirect(isPopup() ? PATH_TO.POPUP : PATH_TO.OPTIONS),
          },
          {
            path: PATH_TO.OPTIONS,
            element: <Options />,
          },
          {
            path: PATH_TO.POPUP,
            loader: PopupLoader,
            element: <Popup_Suspended />,
          },
          {
            path: PATH_TO.WELCOME,
            element: <Welcome />,
          },
          {
            path: PATH_TO.PIN_EXTENSION_TO_TOOLBAR,
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
