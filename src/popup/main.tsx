import ReactDOM from "react-dom/client";
import { Providers } from "../components/Providers/Providers";
import { App } from "./components/App";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

ReactDOM.createRoot(root).render(
  <Providers>
    <App />
  </Providers>,
);
