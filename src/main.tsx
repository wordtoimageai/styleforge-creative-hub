import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force clean module reload
createRoot(document.getElementById("root")!).render(<App />);
