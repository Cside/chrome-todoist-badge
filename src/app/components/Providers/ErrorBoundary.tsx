import { useRouteError } from "react-router-dom";
export const ErrorBoundary = (): JSX.Element => {
  const error = useRouteError();
  return (
    // TODO: 画像、インラインでええんかな
    <div role="alert" className="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        {error instanceof Error
          ? error.toString()
          : // 雑だが…。まぁ、天文学的な確率でしか起こり得ないだろうし。
            String(error)}
      </span>
    </div>
  );
};
