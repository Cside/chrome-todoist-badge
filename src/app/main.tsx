import ReactDOM from "react-dom/client";
import { Router } from "./components/Router";

import "../globalUtils";
import "./sentry";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

ReactDOM.createRoot(root).render(<Router />);
