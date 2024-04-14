import { Suspense } from "react";
import * as api from "../../api/useApi";
import "../../globalUtils";
import * as storage from "../../useStorage";
import { Spinner } from "./Spinner";

const PROJECT_ID_ALL = "__all";
const DEFAULT_PROJECT_ID = PROJECT_ID_ALL;

const Main_Suspended = () => {
  const [isInitialized, setIsInitialized] = storage.useIsInitialized_Suspended();
  const projects = api.useProjects_Suspended();

  // TODO: projectId が projects に含まれているかチェックする
  // (project がアーカイブ/削除されていれば、含まれない)
  const [projectId, setProjectId] = storage.useFilteringProjectId_Suspended();
  const [filterByDueByToday, setFilterByDueByToday] = storage.useFilterByDueByToday_Suspended();

  const { data: tasks, isSuccess: areTasksFetched } = api.useTasks({
    projectId,
    filterByDueByToday,
  });

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <div className="flex">
          <label htmlFor="project-id" className="label cursor-pointer">
            Project:
          </label>
          <select
            value={projectId ?? DEFAULT_PROJECT_ID}
            onChange={(event) => {
              const newValue =
                event.target.value === PROJECT_ID_ALL ? undefined : event.target.value;
              setProjectId(newValue);
            }}
            className="select select-bordered"
          >
            <option value={PROJECT_ID_ALL}>All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={filterByDueByToday}
            onChange={(event) => setFilterByDueByToday(event.target.checked)}
            id="filter-by-due-by-today"
            className="toggle toggle-primary"
          />
          <label htmlFor="filter-by-due-by-today" className="label cursor-pointer">
            Tasks due by today
          </label>
        </div>
      </div>

      <div>{areTasksFetched ? <>{tasks.length} Tasks</> : <Spinner className="ml-16" />}</div>
      {isInitialized || (
        <div>
          <button type="submit" className="btn btn-primary" onClick={() => setIsInitialized(true)}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default function Options_Suspended() {
  return (
    <div>
      <h1>Filtering Tasks</h1>
      <Suspense fallback={<Spinner className="ml-16" />}>
        <Main_Suspended />
      </Suspense>
    </div>
  );
}
