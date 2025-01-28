import { clsx } from "clsx";
import { Suspense, useCallback, useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { isNonEmpty } from "ts-array-length";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import { useProjects } from "../../api/projects/useProjects";
import { useSections } from "../../api/sections/useSections";
import { useTasks } from "../../api/tasks/useTasks";
import { INTERVAL_MINUTES } from "../../background/tasks/watch_tasksCacheRefresh_andBadgeCountUpdates/refreshTasksCache_andUpdateBadgeCount_regularly";
import { SECTION_ID_FOR_STORAGE } from "../../constants/options";
import { PATH_TO } from "../../constants/paths";
import { STORAGE_KEY_FOR } from "../../storage/storageKeys";
import * as storage from "../../storage/useStorage";
import type { ProjectId, Section } from "../../types";
import { isTasksPage } from "../fn/isTasks";
import { useBadgeUpdate_andSetCache } from "../hooks/useBadgeUpdate_andSetCache";
import { Spinner } from "./Spinner";

const api = { useProjects, useTasks, useSections };

const Main_Suspended = () => {
  const [isInitialized, setIsInitialized] =
    storage.useIsConfigInitialized_Suspended();
  const [filterByDueByToday, setFilterByDueByToday] =
    storage.useFilterByDueByToday_Suspended();
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
    if (areProjectsLoaded && projectId === undefined)
      setProjectId(getFirstProjectId_WithAssert());
  }, [areProjectsLoaded, projectId]);

  // ==================================================
  // All sections && Filtering sectionId
  // ==================================================
  const { data: sections, isSuccess: areSectionsLoaded } = api.useSections();
  const [sectionId, setSectionId, removeSectionId] =
    storage.useFilteringSectionId_Suspended();

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
  useBadgeUpdate_andSetCache({ tasks, areTasksLoaded });

  return (
    <div className="flex flex-col gap-y-3">
      <table className="my-0 table">
        <tbody>
          <tr className="border-none">
            <th className="w-48 font-normal">
              <label htmlFor="select-for-project" className="label cursor-pointer">
                Project:
              </label>
            </th>
            <td>
              {areProjectsLoaded ? (
                <select
                  id="select-for-project"
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
                <label htmlFor="select-for-section" className="label cursor-pointer">
                  Section:
                </label>
              </th>
              <td>
                <select
                  id="select-for-section"
                  value={sectionId ?? SECTION_ID_FOR_STORAGE.ALL}
                  onChange={(event) => {
                    const value = event.target.value;
                    value === SECTION_ID_FOR_STORAGE.ALL
                      ? removeSectionId()
                      : setSectionId(value);
                  }}
                  className="select select-bordered"
                >
                  <option value={SECTION_ID_FOR_STORAGE.ALL}>(All)</option>
                  <option value={SECTION_ID_FOR_STORAGE.NO_PARENT}>
                    (No parent section)
                  </option>
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
              <label
                htmlFor="filter-by-due-by-today"
                className="label cursor-pointer"
              >
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

      {/* Debug */}
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              areTasksSuccess: areTasksLoaded && undefined,
              areProjectsSuccess: areProjectsLoaded && undefined,
              areSectionsSuccess: areSectionsLoaded && undefined,
            },
            null,
            "  ",
          )}
        </code>
      </pre> */}

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
                  navigate(isTasksPage() ? PATH_TO.TASKS : PATH_TO.WELCOME);
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
        <span className="font-bold italic">every {INTERVAL_MINUTES} minutes</span>.
      </div>
    </div>
  );
};

export default function Options() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") ?? "";
  return (
    <>
      {from === "tasks" && (
        <NavLink to={PATH_TO.TASKS}>
          <div className="inline-flex items-center justify-center gap-x-1 text-neutral-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{ width: "1lh", height: "1lh" }}
            >
              <path
                fillRule="evenodd"
                d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
              />
            </svg>
            Back to tasks
          </div>
        </NavLink>
      )}
      <h1>Filtering Tasks</h1>
      <Suspense fallback={<Spinner className="ml-16" />}>
        <Main_Suspended />
      </Suspense>
    </>
  );
}
