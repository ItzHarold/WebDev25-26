import React from "react";
import ReactDOM from "react-dom/client";
import EventsPage from "./pages/EventsPage";
import "./styles/base.css";
import "./styles/darkmode.css";
import "./styles/events.css";
import "./styles/topbar.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EventsPage />
  </React.StrictMode>
);
