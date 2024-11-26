import { HTTPError } from "ky";
import { useRouteError } from "react-router-dom";
import { STATUS_CODE_FOR } from "../../../constants/statusCodes";
import { WEB_APP_URL_FOR } from "../../../constants/urls";
import { isTasksPage } from "../../fn/isTasks";

export const ErrorBoundary = (): JSX.Element => {
  const error = useRouteError();

  if (
    error instanceof HTTPError &&
    error.response.status === STATUS_CODE_FOR.BAD_REQUEST
  )
    /*
      useEffect(() => navigate('/options'), [error]);
        だと、無限ループになってしまうため、リロードする⋯。
      useEffect で reload すると、一瞬エラー画面が見えてしまうので、
        お行儀悪いけど useEffect 使わない⋯
    */
    location.reload();

  if (
    error instanceof HTTPError &&
    error.response.status === STATUS_CODE_FOR.UNAUTHORIZED
  )
    return (
      <>
        <h1 className="text-3xl text-error">You are not logged in to Todoist</h1>
        <p>
          Please login to{" "}
          <a href={WEB_APP_URL_FOR.LOGIN} target="_blank" rel="noreferrer">
            Todoist on Web
          </a>
          .
        </p>
        {!isTasksPage() && (
          <div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => location.reload()}
            >
              I have logged in.
            </button>
          </div>
        )}
      </>
    );

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
