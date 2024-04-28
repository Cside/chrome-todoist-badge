import { useRouteError } from "react-router-dom";

export const ErrorBoundary = (): JSX.Element => {
  const error = useRouteError();
  return (
    <>
      <h1 className="text-error">
        {(error instanceof Error && error.stack?.split("\n")[0]) ?? "Error"}
      </h1>
      <pre className="overflow-x-visible bg-transparent text-inherit">
        {error instanceof Error
          ? error.stack
          : // 雑だが…。まぁ、天文学的な確率でしか起こり得ないだろうし。
            String(error)}
      </pre>
    </>
  );
};
