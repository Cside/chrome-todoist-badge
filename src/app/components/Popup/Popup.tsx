import todoistIcon from "@/assets/images/todoist.webp";
import { STORAGE_KEY_FOR } from "@/src/constants/storageKeys";
import { WEB_APP_URL_FOR } from "@/src/constants/urls";
import { setBadgeText } from "@/src/fn/setBadgeText";
import Markdown from "markdown-to-jsx";
import { NavLink } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import { storage as wxtStorage } from "wxt/storage";
import type { Task } from "../../../api/types";
import * as api from "../../../api/useApi";
import * as storage from "../../../useStorage";
import { Spinner } from "../Spinner";

export default function Popup_Suspended() {
  const {
    data: tasks,
    isSuccess: areTasksFetched,
    isFetching: areTasksFetching,
  } = api.useTasks_Suspended();
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
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <Markdown>{task.content}</Markdown>
            </li>
          ))}
        </ul>
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

const useWebAppUrl = () => {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  return projectId === undefined ? WEB_APP_URL_FOR.HOME : WEB_APP_URL_FOR.PROJECT_FOR(projectId);
};
