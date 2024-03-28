import { useSuspenseProjects, useTaskCount } from "@/src/api/useApi";
import { Suspense } from "react";
import useAsyncEffect from "use-async-effect";
import { updateBadgeCountByParamsWithRetry } from "../background/updateBadge/updateBadgeCount";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../constants/options";
import {
  useFilterByDueByTodayMutation,
  useFilteringProjectIdMutation,
  useSuspenseFilterByDueByToday,
  useSuspenseFilteringProjectId,
} from "../useStorage";
import "./../globalUtils";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryClientProvider } from "./components/QueryClientProvider";

const PROJECT_ID_NOT_SELECTED = "__notSelected";

function App() {
  const { data: projects } = useSuspenseProjects();
  const projectId = useSuspenseFilteringProjectId();
  const filterByDueByToday = useSuspenseFilterByDueByToday();
  const { mutate: setProjectId } = useFilteringProjectIdMutation();
  const { mutate: setFilterByDueByToday } = useFilterByDueByTodayMutation();
  const { data: tasksCount, isPending: isTaskCountPending } = useTaskCount({
    projectId,
    filterByDueByToday,
  });

  useAsyncEffect(async () => {
    await updateBadgeCountByParamsWithRetry({ projectId, filterByDueByToday, via: "popup" });
  }, [projectId, filterByDueByToday]);

  return (
    <div>
      <h1>Filtering Tasks</h1>
      <div>
        <div>
          Project:{" "}
          <select
            value={projectId ?? PROJECT_ID_NOT_SELECTED}
            onChange={(event) => setProjectId(event.target.value)}
          >
            <option value={PROJECT_ID_NOT_SELECTED} disabled>
              Not selected
            </option>
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
            checked={filterByDueByToday ?? DEFAULT_FILTER_BY_DUE_BY_TODAY}
            onChange={(event) => setFilterByDueByToday(event.target.checked)}
            id="filterByDueByToday"
          />{" "}
          <label htmlFor="filterByDueByToday">Tasks due by today</label>
        </div>
        <div style={{ ...(isTaskCountPending && { visibility: "hidden" }) }}>
          {tasksCount} Tasks
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
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
