import { DEFAULT_FILTER_BY_DUE_BY_TODAY } from "@/src/constants/options";
import Markdown from "markdown-to-jsx";
import { NavLink } from "react-router-dom";
import * as api from "../../api/useApi";
import * as storage from "../../useStorage";
import { Spinner } from "./Spinner";

export default function Popup_Suspended() {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  const [filterByDueByToday = DEFAULT_FILTER_BY_DUE_BY_TODAY] =
    storage.useFilterByDueByToday_Suspended();

  const { data: tasks, isSuccess: areTasksFetched } = api.useTasks({
    projectId,
    filterByDueByToday,
  });
  console.log(tasks);
  return (
    <div>
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
      <NavLink to="/options" className="btn btn-primary">
        Change task filters
      </NavLink>
    </div>
  );
}
