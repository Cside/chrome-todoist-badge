import * as apiProjects from "@/src/api/projects/useProjects";
import { INTERVAL_MINUTES } from "@/src/background/updateBadgeCount/updateBadgeCountRegularly";
import { setBadgeText } from "@/src/fn/setBadgeText";
import { STORAGE_KEY_FOR } from "@/src/storage/queryKeys";
import { Suspense, useCallback, useEffect } from "react";
import { isNonEmpty } from "ts-array-length";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import * as apiTasks from "../../api/tasks/useTasks";
import type { Task } from "../../api/types";
import "../../globalUtils";
import * as storage from "../../storage/useStorage";
import { Spinner } from "./Spinner";

const api = { ...apiProjects, ...apiTasks };

const Main_Suspended = () => {
  const [isInitialized, mutateIsInitialized] = storage.useIsConfigInitialized_Suspended();
  const { data: projects, isSuccess: areProjectsLoaded } = api.useProjects();

  // TODO: projectId が projects に含まれているかチェックする
  // (project がアーカイブ/削除されていれば、含まれない)
  const [projectId, mutateProjectId] = storage.useFilteringProjectId_Suspended();
  const getFallbackProjectId_WithAssert = useCallback((): string => {
    if (!areProjectsLoaded) throw new Error("projects are not loaded");
    if (!isNonEmpty(projects)) throw new Error("projects are empty");
    return projects[0].id;
  }, []);
  const getSelectedProjectId_WithAssert = useCallback(
    (): string => projectId ?? getFallbackProjectId_WithAssert(),
    [],
  );
  // set initial projectId to storage
  useEffect(() => {
    if (areProjectsLoaded && projectId === undefined)
      mutateProjectId(getFallbackProjectId_WithAssert());
  }, [areProjectsLoaded, projectId]);

  const [filterByDueByToday, mutateFilterByDueByToday] = storage.useFilterByDueByToday_Suspended();

  // TODO: sectionId が存在するかチェックする?
  const { data: tasks, isSuccess: areTasksLoaded } = api.useTasks({
    projectId: getSelectedProjectId_WithAssert(),
    filterByDueByToday,
    enabled: projectId !== undefined ? true : areProjectsLoaded,
  });

  // const { data: tasks, isSuccess: areTasksLoaded } = api.useTasks({
  //   projectId: selectedProjectId,
  //   filterByDueByToday,
  // });

  useAsyncEffect(async () => {
    // あえて共通化してない
    if (areTasksLoaded) {
      await setBadgeText(tasks.length);
      await wxtStorage.setItem<Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);
    }
  }, [tasks, areTasksLoaded]);

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        {areProjectsLoaded ? (
          <div className="flex">
            <label htmlFor="project-id" className="label cursor-pointer">
              Project:
            </label>
            <select
              value={getSelectedProjectId_WithAssert()}
              onChange={(event) => mutateProjectId(event.target.value)}
              className="select select-bordered"
              required
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Spinner />
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={filterByDueByToday}
            onChange={(event) => mutateFilterByDueByToday(event.target.checked)}
            id="filter-by-due-by-today"
            className="toggle toggle-primary"
          />
          <label htmlFor="filter-by-due-by-today" className="label cursor-pointer">
            Tasks due by today
          </label>
        </div>
      </div>
      <div>{areTasksLoaded ? <>{tasks.length} Tasks</> : <Spinner className="ml-16" />}</div>
      {isInitialized === undefined && (
        <div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={async () => mutateIsInitialized(true)}
          >
            Save
          </button>
        </div>
      )}

      <hr className="my-1" />
      <div className="text-neutral-400">
        * Badge number are updated{" "}
        <span className="underline">every {INTERVAL_MINUTES} minutes</span>.
      </div>
    </div>
  );
};

export default function Options() {
  return (
    <>
      <h1>Filtering Tasks</h1>
      <Suspense fallback={<Spinner className="ml-16" />}>
        <Main_Suspended />
      </Suspense>
    </>
  );
}
