import todoistIcon from "@/assets/images/todoist.webp";
import { setBadgeText } from "@/src/fn/setBadgeText";
import { STORAGE_KEY_FOR } from "@/src/storage/storageKeys";
import Markdown from "markdown-to-jsx";
import React from "react";
import { NavLink } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import * as api from "../../../api/tasks/useTasks";
import type { Task } from "../../../api/types";
import { Spinner } from "../Spinner";
import { groupTasksBySectionId, useWebAppUrl } from "./fn/utils";

// 初期化が終わってないと Options.tsx にリダイレクトするので
// projectId がある前提の作りにする。
export default function Popup_Suspended() {
  const {
    data: tasks,
    isSuccess: areTasksFetched,
    isFetching: areTasksFetching,
  } = api.useTasksWithCache(); // 内部で storage を suspended している
  const webAppUrl = useWebAppUrl();

  useAsyncEffect(async () => {
    // あえて共通化してない
    if (areTasksFetched) {
      await setBadgeText(tasks.length);
      await wxtStorage.setItem<Task[]>(STORAGE_KEY_FOR.CACHE.TASKS, tasks);
    }
  }, [tasks, areTasksFetched]);

  return (
    <>
      {areTasksFetched ? (
        groupTasksBySectionId(tasks).map((group) => (
          <React.Fragment key={group.sectionId}>
            {group.sectionId !== null && <h2>{group.sectionId}</h2>}
            <ul>
              {group.tasks.map((task) => (
                <li key={task.id}>
                  <Markdown>{task.content}</Markdown>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))
      ) : (
        <Spinner className="m-5" />
      )}

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
      {areTasksFetching && <Spinner className="fixed top-7 right-7" />}
    </>
  );
}
