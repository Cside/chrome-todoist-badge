import todoistIcon from "@/assets/images/todoist.webp";
import { uniq } from "es-toolkit/compat";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useCachedSections } from "../../../api/sections/useSections";
import { useCachedTasks } from "../../../api/tasks/useTasks";
import { PATH_TO } from "../../../constants/paths";
import { useBadgeUpdate_andSetCache } from "../../hooks/useBadgeUpdate_andSetCache";
import { Spinner } from "../Spinner";
import { getUnknownSectionIds, groupTasksBySectionId } from "./fn/utils";
import { useWebAppUrl } from "./hooks";

const api = { useCachedTasks, useCachedSections };

const ICON_LENGTH = 30;
const PATH_TO_OPTIONS = addFromParam(PATH_TO.OPTIONS);

export default function Tasks_Suspended() {
  const [areCachesAvailable, setAreCachesAvailable] = useState(true);
  const {
    data: tasks,
    isSuccess: areTasksLoaded,
    isFetching: areTasksFetching,
  } = api.useCachedTasks({ isCacheAvailable: areCachesAvailable });
  const webAppUrl = useWebAppUrl();
  const {
    data: sections,
    isSuccess: areSectionsLoaded,
    isFetching: areSectionsFetching,
  } = api.useCachedSections({ isCacheAvailable: areCachesAvailable });

  /*
    tasks.sectionId の中に、sections.id に含まれていないものがある場合、cache を再 set する。
      tasks:    a, X
      sections, a, b
    逆に、sections.id の中に、tasks.sectionId に含まれていないものがある場合もあるが
    実害は無いのでスルーする。
      tasks:    a
      sections, a, X

    cache の再 set：sections, tasks どちらが古い場合もありうるので、どっちも再 set する。
    ( invalidate しないでいい。キャッシュを使わないだけで、再 set される）
  */
  useEffect(() => {
    if (areTasksLoaded && areSectionsLoaded && areCachesAvailable) {
      const notIncluded = getUnknownSectionIds({ tasks, sections });
      if (notIncluded.length > 0) {
        console.error(
          // biome-ignore format:
          `task.sectionId were found in sections. ids: ${JSON.stringify({
            notIncluded,
            tasksIds: uniq(tasks.map((task) => task.sectionId).sort()),
            sectionIds: uniq(sections.map((section) => section.id).sort()),
          }, null, 2)}`,
        );
        setAreCachesAvailable(false);
      }
    }
  }, [areTasksLoaded, tasks, areSectionsLoaded, sections]);

  useBadgeUpdate_andSetCache({ tasks, areTasksLoaded });

  const GroupedTasks = useMemo(
    () =>
      areTasksLoaded && areSectionsLoaded ? (
        (() => {
          const groupedTasks = groupTasksBySectionId({ tasks, sections }).map(
            (group, index) => (
              <React.Fragment key={group.section?.id ?? `undefinedSection-${index}`}>
                {group.section !== undefined && (
                  <h2 className="my-4">{group.section.name}</h2>
                )}
                <ul>
                  {group.tasks.map((task) => (
                    <li key={task.id}>
                      {/* Markdown の中に a タグが入り込みうるため、div にする */}
                      <div
                        className="link link-hover m-0"
                        onClick={(event) => {
                          if (event.target instanceof HTMLAnchorElement) {
                            event.preventDefault();
                            window.open(event.target.href);
                            return;
                          }
                          window.open(task.url);
                        }}
                      >
                        {/* 「------------」は Markdown にしない */}
                        {/^-+$/.test(task.content) ? (
                          task.content
                        ) : (
                          <Markdown>{task.content}</Markdown>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            ),
          );
          return groupedTasks.length > 0 ? (
            groupedTasks
          ) : (
            <div className="mt-3 mb-5 ml-1">All done!</div>
          );
        })()
      ) : (
        <Spinner className="m-5" />
      ),
    [areTasksLoaded, areSectionsLoaded, tasks, sections],
  );

  return (
    <>
      {GroupedTasks}

      <div className="flex gap-x-3">
        <a
          href={webAppUrl}
          className="btn btn-primary px-3"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={todoistIcon}
            width={ICON_LENGTH}
            height={ICON_LENGTH}
            className="m-0"
          />
          Open Todoist
        </a>
        <NavLink to={PATH_TO_OPTIONS} className="btn btn-primary px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ICON_LENGTH}
            height={ICON_LENGTH}
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
          </svg>
          Change task filters
        </NavLink>
        <a
          href="https://ko-fi.com/Cside"
          target="_blank"
          className="btn btn-active btn-ghost flex columns-3 gap-x-1 px-3"
          rel="noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#fc3e30"
            viewBox="0 0 16 16"
          >
            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
          </svg>
          Donation
        </a>
      </div>
      {(areTasksFetching || areSectionsFetching) && (
        <Spinner className="fixed top-7 right-7" />
      )}
    </>
  );
}

// 2 回以上同じうような関数を作るなら、共通化する
function addFromParam(path: string): string {
  const url = new URL(path, "https://null");
  url.searchParams.set("from", "tasks");
  return url.pathname + url.search;
}
