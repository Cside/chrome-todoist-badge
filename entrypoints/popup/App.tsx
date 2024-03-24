import { getProjects } from "@/src/api/api";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { storage } from "wxt/storage";
import "./App.css";

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

const filteringProjectFn = storage.defineItem<string>("local:config:filtering:project");

function App() {
  const queryClient = useQueryClient();
  const { data: projects } = useSuspenseQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const { data: filteringProjectId } = useSuspenseQuery({
    queryKey: ["config:filtering:project"],
    queryFn: async () => filteringProjectFn.getValue(),
  });
  const { mutate } = useMutation({
    mutationFn: async (projectId: string) => filteringProjectFn.setValue(projectId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["config:filtering:project"],
      }),
  });

  return (
    <div>
      <h1>Filtering Tasks</h1>
      <div>
        <div>
          Project:{" "}
          <select
            value={filteringProjectId ?? "__notSelected"}
            onChange={(event) => mutate(event.target.value)}
          >
            <option value={"__notSelected"} disabled>
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
          <input type="checkbox" name="" /> <label htmlFor="">Due Today</label>
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
