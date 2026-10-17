import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import "./styles/fonts.scss";
import './styles/variables.scss'
import App from "./App.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Navbar />
    <App />
  </StrictMode>,
);
