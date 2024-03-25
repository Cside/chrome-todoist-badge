import {
  useFilterByDueByTodayMutation,
  useFilteringProjectIdMutation,
  useSuspenseFilterByDueByToday,
  useSuspenseFilteringProjectId,
  useSuspenseProjects,
} from "@/src/api/useApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  // https://tanstack.com/query/latest/docs/reference/QueryClient
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
      throwOnError: true,
      networkMode: "always", // ネットワークに繋がってないとき用の案内を出すのもだるいので
    },
  },
});

const PROJECT_ID_NOT_SELECTED = "__notSelected";
function App() {
  const { data: projects } = useSuspenseProjects();
  const { data: projectId } = useSuspenseFilteringProjectId();
  const { data: filterByDueByToday } = useSuspenseFilterByDueByToday();
  const { mutate: setProjectId } = useFilteringProjectIdMutation();
  const { mutate: setFilterByDueByToday } = useFilterByDueByTodayMutation();

  return (
    <div>
      <h1>Filtering Tasks</h1>
      <div>
        <div>
          Project:{" "}
          <select
            value={projectId ?? PROJECT_ID_NOT_SELECTED}
            onChange={(event) => setProjectId(event.target.value)}
          >
            <option value={PROJECT_ID_NOT_SELECTED} disabled>
              Not selected
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="checkbox"
            checked={filterByDueByToday ?? false}
            onChange={(event) => setFilterByDueByToday(event.target.checked)}
            id="filterByDueByToday"
          />{" "}
          <label htmlFor="filterByDueByToday">Tasks due by today</label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </div>
    </div>
  );
}

export default () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
