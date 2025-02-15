import { Suspense, useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createHashRouter,
  redirect,
} from "react-router-dom";
import { EXTENSION_NAME } from "../../constants/extensionName";
import { PATH_TO } from "../../constants/paths";
import { isTasksPage } from "../fn/isTasks";
import Options from "./Options";
import PinExtensionToToolbar from "./PinExtensionToToolbar";
import { ErrorBoundary } from "./Providers/ErrorBoundary";
import { QueryClientProvider } from "./Providers/QueryClientProvider";
import { Spinner } from "./Spinner";
import Tasks_Suspended from "./Tasks/Tasks";
import { TasksLoader } from "./Tasks/TasksLoader";
import Welcome from "./Welcome";

// sync import にしても初期描画速度遅くならないので。
// 逆に、dynamic import にすると、Spinner がしばらく表示されて体験が悪くなる。

const Container = () => {
  useEffect(() => {
    document.title = EXTENSION_NAME;
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
          // かといって、Tasks.tsx, Options.tsx それぞれで Provider で囲むのは
          // DRY じゃないし…( TQ 以外にも Provider が増えたら地獄)
          <Container />
        ),
        children: [
          {
            index: true,
            loader: () => redirect(isTasksPage() ? PATH_TO.TASKS : PATH_TO.OPTIONS),
          },
          {
            path: PATH_TO.OPTIONS,
            element: <Options />,
          },
          {
            path: PATH_TO.TASKS,
            loader: TasksLoader,
            element: <Tasks_Suspended />,
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
    future={{
      v7_startTransition: true,
      // @ts-ignore
      v7_relativeSplatPath: true,
      // See https://www.notion.so/189cb33a6a1f81c49990f53ea0fdced5
    }}
  />
);
