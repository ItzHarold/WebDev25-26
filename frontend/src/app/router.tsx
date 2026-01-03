import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "../features/auth/requireAuth";
import AppLayout from "../shared/ui/AppLayout";

import HomePage from "../pages/Home/HomePage";
import EventsPage from "../pages/Events/EventsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import LoginPage from "../pages/Login/LoginPage";
import AboutPage from "../pages/About/AboutPage";
import RegisterPage from "../pages/Register/RegisterPage";
import ContactPage from "../pages/Contact/ContactPage";
import FavouritesPage from "../pages/Favourites/FavouritesPage";
import TeamPage from "../pages/Team/TeamPage";


export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "events/:id", element: <EventsPage /> },
          { path: "favourites", element: <FavouritesPage /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "contact", element: <ContactPage /> },
          { path: "about", element: <AboutPage /> },
          { path: "team", element: <TeamPage />}
        ],
      },
    ],
  },
]);
