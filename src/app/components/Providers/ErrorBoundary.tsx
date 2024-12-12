import { HTTPError } from "ky";
import { useRouteError } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import {
  cleanupStorage,
  isBadRequestErrorForTaskFetch,
} from "../../../api/tasks/getTasks";
import { STATUS_CODE_FOR } from "../../../constants/statusCodes";
import { WEB_APP_URL_FOR } from "../../../constants/urls";
import { isTasksPage } from "../../fn/isTasks";

export const ErrorBoundary = (): JSX.Element => {
  const error = useRouteError();

  useAsyncEffect(async () => {
    if (isBadRequestErrorForTaskFetch(error)) {
      await cleanupStorage(error);
      // useEffect(() => navigate('/options'), [error]);
      // だと、error が消えなくて無限ループになってしまうため、リロードする⋯。
      location.reload();
    }
  }, [error]);

  if (isBadRequestErrorForTaskFetch(error)) return <>Bad Request. Reloading...</>;

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
      <h1 className="my-3 text-error">
        {(error instanceof Error && error.message.split("\n")[0]) ?? "Error"}
      </h1>
      {error instanceof Error && error.message.includes("\n") ? (
        <>
          <h2 className="my-0 text-lg">message:</h2>
          <pre className="my-0 overflow-x-visible bg-transparent text-inherit">
            {error.message}
          </pre>
        </>
      ) : null}
      <h2 className="my-0 text-lg">stack trace:</h2>
      <pre className="my-0 overflow-x-visible bg-transparent text-inherit">
        {error instanceof Error
          ? error.stack
          : // 雑だが…。まぁ、天文学的な確率でしか起こり得ないだろうし。
            String(error)}
      </pre>
    </>
  );
};
