import { INTERVAL_MINUTES } from "@/src/background/updateBadgeCount/updateBadgeCountRegularly";
import { setBadgeText } from "@/src/fn/setBadgeText";
import { STORAGE_KEY_FOR } from "@/src/storage/queryKeys";
import { Suspense } from "react";
import { hasMinLength } from "ts-array-length";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import type { Task } from "../../api/types";
import * as api from "../../api/useApi";
import "../../globalUtils";
import * as storage from "../../storage/useStorage";
import { Spinner } from "./Spinner";

const Main_Suspended = () => {
  const [isInitialized, mutateIsInitialized] = storage.useIsConfigInitialized_Suspended();
  const projects = api.useProjects_Suspended();
  if (!hasMinLength(projects, 1)) throw new Error("projects is empty");

  // TODO: projectId が projects に含まれているかチェックする
  // (project がアーカイブ/削除されていれば、含まれない)
  const [selectedProjectId = projects[0].id, mutateSelectedProjectId] =
    storage.useFilteringProjectId_Suspended();
  const [filterByDueByToday, mutateFilterByDueByToday] = storage.useFilterByDueByToday_Suspended();

  const { data: tasks, isSuccess: areTasksFetched } = api.useTasks({
    projectId: selectedProjectId,
    filterByDueByToday,
  });

  useAsyncEffect(async () => {
    // あえて共通化してない
    if (areTasksFetched) {
      await setBadgeText(tasks.length);
      await wxtStorage.setItem<Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);
    }
  }, [tasks, areTasksFetched]);

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <div className="flex">
          <label htmlFor="project-id" className="label cursor-pointer">
            Project:
          </label>
          <select
            value={selectedProjectId}
            onChange={(event) => mutateSelectedProjectId(event.target.value)}
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
      <div>{areTasksFetched ? <>{tasks.length} Tasks</> : <Spinner className="ml-16" />}</div>
      {isInitialized || (
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
        * Badge number are updated every {INTERVAL_MINUTES} minutes.
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
