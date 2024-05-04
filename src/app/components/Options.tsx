import { clsx } from "clsx";
import { Suspense, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isNonEmpty } from "ts-array-length";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import { useProjects } from "../../api/projects/useProjects";
import { useSections } from "../../api/sections/useSections";
import { useTasks } from "../../api/tasks/useTasks";
import { INTERVAL_MINUTES } from "../../background/tasks/activate_tasksCacheRefresh_andBadgeCountUpdates/refreshTasksCache_andUpdateBadgeCount/refreshTasksCache_andUpdateBadgeCount_regularly";
import { SECTION_ID_FOR } from "../../constants/options";
import { PATH_TO } from "../../constants/paths";
import { setBadgeText } from "../../fn/setBadgeText";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import * as storage from "../../storage/useStorage";
import type { ProjectId, Section, Task } from "../../types";
import { isPopup } from "../fn/isPopup";
import { Spinner } from "./Spinner";

const api = { useProjects, useTasks, useSections };

const Main_Suspended = () => {
  const [isInitialized, setIsInitialized] = storage.useIsConfigInitialized_Suspended();
  const [filterByDueByToday, setFilterByDueByToday] = storage.useFilterByDueByToday_Suspended();
  const navigate = useNavigate();

  // ==================================================
  // All projects && Filtering projectId
  // ==================================================
  const { data: projects, isSuccess: areProjectsLoaded } = api.useProjects();

  // TODO: projectId が projects に含まれているかチェックする
  // (project がアーカイブ/削除されていれば、含まれない)
  const [projectId, setProjectId] = storage.useFilteringProjectId_Suspended();
  const getFirstProjectId_WithAssert = useCallback((): ProjectId => {
    if (!areProjectsLoaded) throw new Error("projects are not loaded");
    if (!isNonEmpty(projects)) throw new Error("projects are empty");
    return projects[0].id;
  }, [areProjectsLoaded]);

  // set initial projectId to storage
  useEffect(() => {
    if (areProjectsLoaded && projectId === undefined) setProjectId(getFirstProjectId_WithAssert());
  }, [areProjectsLoaded, projectId]);

  // ==================================================
  // All sections && Filtering sectionId
  // ==================================================
  const { data: sections, isSuccess: areSectionsLoaded } = api.useSections();
  const [sectionId, setSectionId, removeSectionId] = storage.useFilteringSectionId_Suspended();

  useAsyncEffect(async () => {
    if (areSectionsLoaded)
      // Popup とは別 Window なので TQ は使う意味ない。
      await wxtStorage.setItem<Section[]>(STORAGE_KEY_FOR.CACHE.SECTIONS, sections); // retry はサボる
  }, [sections, areSectionsLoaded]);

  // ==================================================
  // Tasks
  // ==================================================
  // TODO: sectionId が存在するかチェックする?
  const { data: tasks, isSuccess: areTasksLoaded } = api.useTasks({
    filters: {
      projectId: (() => {
        if (projectId !== undefined) return projectId;
        return areProjectsLoaded ? getFirstProjectId_WithAssert() : "";
      })(),
      filterByDueByToday,
      sectionId,
    },
    enabled: projectId !== undefined || areProjectsLoaded,
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
                  value={projectId ?? getFirstProjectId_WithAssert()}
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

          {areSectionsLoaded && sections.length > 0 ? (
            <tr className="border-none">
              <th className="w-48 font-normal">
                <label className="label cursor-pointer">Section:</label>
              </th>
              <td>
                <select
                  value={sectionId ?? SECTION_ID_FOR.ALL}
                  onChange={(event) => {
                    const value = event.target.value;
                    value === SECTION_ID_FOR.ALL ? removeSectionId() : setSectionId(value);
                  }}
                  className="select select-bordered"
                >
                  <option value={SECTION_ID_FOR.ALL}>(All)</option>
                  <option value={SECTION_ID_FOR.NO_PARENT}>(No parent section)</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ) : null}

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

      <pre>
        <code>
          {JSON.stringify(
            {
              areTasksLoaded: areTasksLoaded && undefined,
              areProjectsLoaded: areProjectsLoaded && undefined,
              areSectionsLoaded: areSectionsLoaded && undefined,
            },
            null,
            "  ",
          )}
        </code>
      </pre>

      {isInitialized || (
        <div>
          <button
            type="submit"
            className={clsx(
              "btn",
              "btn-primary",
              (!areProjectsLoaded || !areSectionsLoaded) && "btn-disabled",
            )}
            onClick={async () =>
              setIsInitialized(true, {
                onSuccess: () => {
                  navigate(isPopup() ? PATH_TO.POPUP : PATH_TO.WELCOME);
                },
              })
            }
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
