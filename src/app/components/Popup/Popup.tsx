import todoistIcon from "@/assets/images/todoist.webp";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import { useSectionsCache } from "../../../api/sections/useSections";
import { useTasksCache } from "../../../api/tasks/useTasks";
import { setBadgeText } from "../../../fn/setBadgeText";
import { STORAGE_KEY_FOR } from "../../../storage/storageKeys";
import type { Task } from "../../../types";
import { Spinner } from "../Spinner";
import { getUnknownSectionIds, groupTasksBySectionId, useWebAppUrl } from "./fn/utils";

const api = { useTasksCache, useSectionsCache };

export default function Popup_Suspended() {
  const {
    data: tasks,
    isSuccess: areTasksLoaded,
    isFetching: areTasksFetching,
  } = api.useTasksCache(); // 内部で storage を suspended している
  const webAppUrl = useWebAppUrl();
  const [isCacheAvailable, setIsCacheAvailable] = useState(true);
  // FIXME これ projectId が無い場合、isSuccess になんのけ・・・
  const {
    data: sections,
    isSuccess: areSectionsLoaded,
    isFetching: areSectionsFetching,
  } = api.useSectionsCache({ isCacheAvailable });

  // TODO: これ useSectionsCache に押し込めても良いかも
  useEffect(() => {
    if (areTasksLoaded && areSectionsLoaded) {
      const notIncluded = getUnknownSectionIds({ tasks, sections });
      if (notIncluded.length > 0) {
        console.error(`task.sectionId were found in sections. ids: ${JSON.stringify(notIncluded)}`);
        setIsCacheAvailable(false);
      }
    }
  }, [areTasksLoaded, tasks, areSectionsLoaded, sections]);

  useAsyncEffect(async () => {
    // バッヂ更新。あえて共通化してない
    if (areTasksLoaded) {
      await setBadgeText(tasks.length);
      await wxtStorage.setItem<Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks); // retry サボる
    }
  }, [tasks, areTasksLoaded]);

  const GroupedTasks = useMemo(
    () =>
      areTasksLoaded && areSectionsLoaded ? (
        // あとで memo 化
        groupTasksBySectionId({ tasks, sections }).map((group) => (
          <React.Fragment key={group.section?.id ?? ""}>
            {group.section !== undefined && <h2 className="my-4">{group.section.name}</h2>}
            <ul>
              {group.tasks.map((task) => (
                <li key={task.id}>
                  <a
                    href={task.url}
                    className="link link-hover m-0 block font-normal"
                    target="_blank" // popup 以外で開かせる予定は今のところ無いから、良いや…
                    rel="noreferrer"
                  >
                    <Markdown>{task.content}</Markdown>
                  </a>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))
      ) : (
        <Spinner className="m-5" />
      ),
    [areTasksLoaded, areSectionsLoaded, tasks, sections],
  );

  return (
    <>
      {GroupedTasks}

      <div className="flex flex-col items-start gap-y-2">
        <div>
          <a href={webAppUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
            <img src={todoistIcon} width="35" height="35" className="m-0" />
            Open Todoist on Web
          </a>
        </div>
        <NavLink to="/options" className="btn btn-primary">
          Change task filters
        </NavLink>
      </div>
      {(areTasksFetching || areSectionsFetching) && <Spinner className="fixed top-7 right-7" />}
    </>
  );
}
