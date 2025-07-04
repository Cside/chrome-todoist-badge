import todoistIcon from "@/assets/images/todoist.webp";
import { uniq } from "es-toolkit/compat";
import { difference } from "lodash-es";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useCachedProjects } from "../../../api/projects/useProjects";
import { useCachedSections } from "../../../api/sections/useSections";
import { useCachedTasks } from "../../../api/tasks/useTasks";
import { PATH_TO } from "../../../constants/paths";
import type { Api } from "../../../types";
import { useBadgeUpdate_andSetCache } from "../../hooks/useBadgeUpdate_andSetCache";
import { Spinner } from "../Spinner";
import { DonationOrReviewButton } from "./DonationOrReviewButton";
import { groupTasksByProject, groupTasksBySection } from "./fn/utils";
import { useWebAppUrl } from "./hooks";

const api = { useCachedTasks, useCachedSections, useCachedProjects };

const ICON_LENGTH = 30;
const PATH_TO_OPTIONS = addFromParam(PATH_TO.OPTIONS);

// eslint-disable-next-line react-refresh/only-export-components
const CenteredSpinner = () => <Spinner className="m-5" />;

export default function Tasks_Suspended() {
  const [isCacheAvailable, setIsCacheAvailable] = useState(true);
  const {
    data: tasks,
    isSuccess: areTasksSucceeded,
    isFetching: areTasksFetching,
  } = api.useCachedTasks({ isCacheAvailable });

  const {
    data: sections,
    isSuccess: areSectionsSucceeded,
    isFetching: areSectionsFetching,
  } = api.useCachedSections({ isCacheAvailable });

  const isCrossProject = tasks
    ? uniq(tasks.map((task) => task.projectId)).length > 1
    : false;
  const {
    data: projects,
    isSuccess: areProjectsSucceeded,
    isFetching: areProjectsFetching,
  } = api.useCachedProjects({
    isCacheAvailable,
    enabled: isCrossProject,
  });

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

  const unknownProjects = useMemo(
    () =>
      isCacheAvailable && isCrossProject && tasks && projects
        ? difference(
            tasks.map((task) => task.projectId),
            projects.map((project) => project.id),
          )
        : [],
    [tasks, projects, isCacheAvailable, isCrossProject],
  );
  useEffect(() => {
    if (unknownProjects.length > 0) {
      console.error(
        `Unknown task.projectId: ${JSON.stringify(unknownProjects)}. Invalidating cache.`,
      );
      setIsCacheAvailable(false);
    }
  }, [unknownProjects]);

  const unknownSections = useMemo(
    () =>
      isCacheAvailable && !isCrossProject && tasks && sections
        ? difference(
            tasks.map((task) => task.sectionId).filter(Boolean),
            sections.map((section) => section.id),
          )
        : [],
    [tasks, sections, isCacheAvailable, isCrossProject],
  );
  useEffect(() => {
    if (unknownSections.length > 0) {
      console.error(
        `Unknown task.sectionId: ${JSON.stringify(unknownSections)}. Invalidating cache.`,
      );
      setIsCacheAvailable(false);
    }
  }, [unknownSections]);

  useBadgeUpdate_andSetCache({ tasks, areTasksLoaded: areTasksSucceeded });

  // 共通化: タスクリストの描画
  const renderTaskList = useCallback(
    (tasks: Api.Task[]) => (
      <ul>
        {tasks.map((task) => (
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
    ),
    [],
  );

  const GroupedTasks = useMemo(() => {
    if (unknownProjects.length > 0 || unknownSections.length > 0)
      return <CenteredSpinner />;

    if (areTasksSucceeded && !isCrossProject && areSectionsSucceeded) {
      const groupedTasks = groupTasksBySection({
        tasks,
        sections,
      }).map((group, index) => (
        <React.Fragment key={group.section?.id ?? `undefinedSection-${index}`}>
          {group.section !== undefined && (
            <h2 className="my-4">{group.section.name}</h2>
          )}
          {renderTaskList(group.tasks)}
        </React.Fragment>
      ));
      return groupedTasks.length > 0 ? (
        groupedTasks
      ) : (
        <div className="mt-3 mb-5 ml-1">All done!</div>
      );
    }
    if (areTasksSucceeded && isCrossProject && areProjectsSucceeded) {
      const groupedTasks = groupTasksByProject({
        tasks,
        projects,
      }).map((group) => (
        <React.Fragment key={group.project.id}>
          <h2 className="my-4">{group.project.name}</h2>
          {renderTaskList(group.tasks)}
        </React.Fragment>
      ));
      return groupedTasks.length > 0 ? (
        groupedTasks
      ) : (
        <div className="mt-3 mb-5 ml-1">All done!</div>
      );
    }
    return <CenteredSpinner />;
  }, [
    unknownProjects,
    unknownSections,
    areTasksSucceeded,
    areSectionsSucceeded,
    areProjectsSucceeded,
    tasks,
    sections,
    projects,
    isCrossProject,
  ]);

  const webAppUrl = useWebAppUrl();

  return (
    <>
      {GroupedTasks}

      {/* Footer ===================================================== */}
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
        <DonationOrReviewButton />
      </div>
      {(areTasksFetching || areSectionsFetching || areProjectsFetching) && (
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
