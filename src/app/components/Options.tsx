import { Suspense, useCallback, useEffect } from "react";
import { isNonEmpty } from "ts-array-length";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import * as apiProjects from "../../api/projects/useProjects";
import * as apiSections from "../../api/sections/useSections";
import * as apiTasks from "../../api/tasks/useTasks";
import type { Task } from "../../api/types";
import { INTERVAL_MINUTES } from "../../background/updateBadgeCount/updateBadgeCountRegularly";
import { setBadgeText } from "../../fn/setBadgeText";
import "../../globalUtils";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import * as storage from "../../storage/useStorage";
import { Spinner } from "./Spinner";

const SECTION_ID_ALL = "__all";

const Main_Suspended = () => {
  const [isInitialized, setIsInitialized] = storage.useIsConfigInitialized_Suspended();
  const [filterByDueByToday, setFilterByDueByToday] = storage.useFilterByDueByToday_Suspended();

  // ==================================================
  // All projects && Filtering projectId
  // ==================================================
  const { data: projects, isSuccess: areProjectsLoaded } = api.useProjects();

  // TODO: projectId が projects に含まれているかチェックする
  // (project がアーカイブ/削除されていれば、含まれない)
  const [projectId, setProjectId] = storage.useFilteringProjectId_Suspended();
  const getFallbackProjectId_WithAssert = useCallback((): string => {
    if (!areProjectsLoaded) throw new Error("projects are not loaded");
    if (!isNonEmpty(projects)) throw new Error("projects are empty");
    return projects[0].id;
  }, []);
  const getSelectedProjectId_WithAssert = useCallback(
    (): string => projectId ?? getFallbackProjectId_WithAssert(),
    [projectId],
  );
  // set initial projectId to storage
  useEffect(() => {
    if (areProjectsLoaded && projectId === undefined)
      setProjectId(getFallbackProjectId_WithAssert());
  }, [areProjectsLoaded, projectId]);

  // ==================================================
  // All sections && Filtering sectionId
  // ==================================================
  const { data: sections, isSuccess: areSectionsLoaded } = api.useSections({ projectId });
  const [sectionId, setSectionId, removeSectionId] = storage.useFilteringSectionId_Suspended();

  // ==================================================
  // Tasks
  // ==================================================
  // TODO: sectionId が存在するかチェックする?
  const { data: tasks, isSuccess: areTasksLoaded } = api.useTasks({
    filters: {
      projectId: getSelectedProjectId_WithAssert(),
      filterByDueByToday,
      sectionId,
    },
    enabled: projectId !== undefined ? true : areProjectsLoaded,
    deps: [projectId, filterByDueByToday, sectionId],
  });
  useAsyncEffect(async () => {
    // あえて共通化してない
    if (areTasksLoaded) {
      await setBadgeText(tasks.length);
      await wxtStorage.setItem<Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);
    }
  }, [tasks, areTasksLoaded]);

  return (
    <div className="flex flex-col gap-y-3">
      <table className="my-0 table">
        <tbody>
          <tr className="border-none">
            <th className="w-48 font-normal">
              <label className="label cursor-pointer">Project:</label>
            </th>
            <td>
              {areProjectsLoaded ? (
                <select
                  value={getSelectedProjectId_WithAssert()}
                  onChange={(event) => {
                    setProjectId(event.target.value);
                    removeSectionId();
                  }}
                  className="select select-bordered"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Spinner />
              )}
            </td>
          </tr>

          {(() => {
            if (!areSectionsLoaded) return null;
            if (sections.length === 0) return null;

            return (
              <tr className="border-none">
                <th className="w-48 font-normal">
                  <label className="label cursor-pointer">Section:</label>
                </th>
                <td>
                  <select
                    value={sectionId ?? SECTION_ID_ALL}
                    onChange={(event) => {
                      const value = event.target.value;
                      value === SECTION_ID_ALL ? removeSectionId() : setSectionId(value);
                    }}
                    className="select select-bordered"
                  >
                    <option value={SECTION_ID_ALL}>All</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })()}

          <tr className="border-none">
            <th className="w-48 font-normal">
              <label htmlFor="filter-by-due-by-today" className="label cursor-pointer">
                Due by today
              </label>
            </th>
            <td>
              <input
                type="checkbox"
                checked={filterByDueByToday}
                onChange={(event) => setFilterByDueByToday(event.target.checked)}
                id="filter-by-due-by-today"
                className="toggle toggle-primary"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        {areTasksLoaded ? (
          <span className="font-bold text-primary">{tasks.length} Tasks</span>
        ) : (
          <Spinner className="ml-16" />
        )}
      </div>

      {isInitialized || (
        <div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={async () => setIsInitialized(true)}
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

const api = {
  useProjects: apiProjects.useProjects,
  useTasks: apiTasks.useTasks,
  useSections: apiSections.useSections,
};
