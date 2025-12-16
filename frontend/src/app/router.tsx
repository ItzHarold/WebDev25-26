import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../shared/ui/AppLayout";
import HomePage from "../pages/Home/HomePage";
import EventsPage from "../pages/Events/EventsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/events", element: <EventsPage /> },
      { path: "/dashboard", element: <DashboardPage /> }
    ],
  },
]);