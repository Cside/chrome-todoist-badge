import { Suspense } from "react";
import useAsyncEffect from "use-async-effect";
import { useSuspenseProjects, useTasksCount } from "../api/useApi";
import { updateBadgeCountByParamsWithRetry } from "../background/updateBadge/updateBadgeCount";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import "../globalUtils";
import {
  useSuspenseFilterByDueByToday,
  useSuspenseFilteringProjectId,
  useSuspenseIsInitialized,
} from "../useStorage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryClientProvider } from "./components/QueryClientProvider";

const PROJECT_ID_ALL = "__all";
const DEFAULT_PROJECT_ID = PROJECT_ID_ALL;

function App() {
  // TODO: projectId が projects に含まれているかチェックする
  // (project がアーカイブ/削除されていれば、含まれない)
  const [projectId, setProjectId] = useSuspenseFilteringProjectId();
  const [filterByDueByToday = DEFAULT_FILTER_BY_DUE_BY_TODAY, setFilterByDueByToday] =
    useSuspenseFilterByDueByToday();
  const [isInitialized, setIsInitialized] = useSuspenseIsInitialized();
  const projects = useSuspenseProjects();
  const { data: tasksCount, isPending: isTaskCountPending } = useTasksCount({
    projectId,
    filterByDueByToday,
  });

  useAsyncEffect(async () => {
    // TODO: 中で fetch しなくても、count だけ渡せばいい説。
    // count をいつまで使い続けるか分からんのでアレだが。。
    await updateBadgeCountByParamsWithRetry({ projectId, filterByDueByToday, via: "options page" });
  }, [projectId, filterByDueByToday]);

  return (
    <div>
      <h1>Filtering Tasks</h1>
      <div>
        <div>
          Project:{" "}
          <select
            value={projectId ?? DEFAULT_PROJECT_ID}
            onChange={(event) => {
              const newValue =
                event.target.value === PROJECT_ID_ALL ? undefined : event.target.value;
              setProjectId(newValue);
            }}
          >
            <option value={PROJECT_ID_ALL}>All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="checkbox"
            checked={filterByDueByToday}
            onChange={(event) => setFilterByDueByToday(event.target.checked)}
            id="filterByDueByToday"
          />{" "}
          <label htmlFor="filterByDueByToday">Tasks due by today</label>
        </div>
        <div style={{ ...(isTaskCountPending && { visibility: "hidden" }) }}>
          {tasksCount} Tasks
        </div>
        {isInitialized || (
          <div>
            <button type="submit" onClick={() => setIsInitialized(true)}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default () => (
  <ErrorBoundary>
    <QueryClientProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </QueryClientProvider>
  </ErrorBoundary>
);
