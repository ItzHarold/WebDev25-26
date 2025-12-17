import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "../features/auth/requireAuth";
import AppLayout from "../shared/ui/AppLayout";

import HomePage from "../pages/Home/HomePage";
import EventsPage from "../pages/Events/EventsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import LoginPage from "../pages/Login/LoginPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "events", element: <EventsPage /> },
          { path: "dashboard", element: <DashboardPage /> },
        ],
      },
    ],
  },
]);
