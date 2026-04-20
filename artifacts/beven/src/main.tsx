import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply saved theme before first render to avoid flash
const savedTheme = localStorage.getItem('beven_theme') ?? 'dark';
if (savedTheme === 'light') {
  document.documentElement.classList.add('light-theme');
} else {
  document.documentElement.classList.remove('light-theme');
}

createRoot(document.getElementById("root")!).render(<App />);
