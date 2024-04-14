import { setBadgeText } from "@/src/fn/setBadgeText";
import Markdown from "markdown-to-jsx";
import { NavLink } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import * as api from "../../api/useApi";
import * as storage from "../../useStorage";
import { Spinner } from "./Spinner";

export default function Popup_Suspended() {
  const [projectId] = storage.useFilteringProjectId_Suspended();
  const [filterByDueByToday] = storage.useFilterByDueByToday_Suspended();

  const { data: tasks, isSuccess: areTasksFetched } = api.useTasks({
    projectId,
    filterByDueByToday,
  });
  console.log(tasks);

  useAsyncEffect(async () => {
    if (areTasksFetched) await setBadgeText(tasks.length);
  }, [tasks, areTasksFetched]);

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
