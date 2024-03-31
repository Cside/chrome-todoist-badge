import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

ReactDOM.createRoot(root).render(<App />);
