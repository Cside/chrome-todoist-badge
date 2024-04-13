import { Suspense } from "react";
import useAsyncEffect from "use-async-effect";
import { useSuspenseProjects, useTasks } from "../../api/useApi";
import { updateBadgeCountByParamsWithRetry } from "../../background/updateBadge/updateBadgeCount";
import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "../../constants/options";
import "../../globalUtils";
import {
  useSuspenseFilterByDueByToday,
  useSuspenseFilteringProjectId,
  useSuspenseIsInitialized,
} from "../../useStorage";
import { Spinner } from "./Spinner";

const PROJECT_ID_ALL = "__all";
const DEFAULT_PROJECT_ID = PROJECT_ID_ALL;

const Main = () => {
  const [isInitialized, setIsInitialized] = useSuspenseIsInitialized();
  const projects = useSuspenseProjects();

  // TODO: projectId が projects に含まれているかチェックする
  // (project がアーカイブ/削除されていれば、含まれない)
  const [projectId, setProjectId] = useSuspenseFilteringProjectId();
  const [filterByDueByToday = DEFAULT_FILTER_BY_DUE_BY_TODAY, setFilterByDueByToday] =
    useSuspenseFilterByDueByToday();
  const { data: tasks, isSuccess: areTasksFetched } = useTasks({
    projectId,
    filterByDueByToday,
  });

  useAsyncEffect(async () => {
    // TODO: 中で fetch しなくても、count だけ渡せばいい説。
    // count をいつまで使い続けるか分からんのでアレだが。。
    await updateBadgeCountByParamsWithRetry({
      projectId,
      filterByDueByToday,
      via: "options page",
    });
  }, [projectId, filterByDueByToday]);

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

export default function Options() {
  return (
    <div>
      <h1>Filtering Tasks</h1>
      <Suspense fallback={<Spinner className="ml-16" />}>
        <Main />
      </Suspense>
    </div>
  );
}
