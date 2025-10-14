import React from "react";
import ReactDOM from "react-dom/client";
import EventsPage from "./pages/EventsPage";
import "./styles/base.css";
import "./styles/darkmode.css";
import "./styles/events.css";
import "./styles/topbar.css";
import HomePage from "./pages/HomePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);
