import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "../features/auth/requireAuth";
import AppLayout from "../shared/ui/AppLayout";

import HomePage from "../pages/Home/HomePage";
import EventsPage from "../pages/Events/EventsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import LoginPage from "../pages/Login/LoginPage";
import AboutPage from "../pages/About/AboutPage";
import { FavouritesProvider } from "../pages/Events/components/FavouritesContext";
import RegisterPage from "../pages/Register/RegisterPage";
import ContactPage from "../pages/Contact/ContactPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element:(<FavouritesProvider><HomePage /></FavouritesProvider>)},
          { path: "events/:id", element: (<FavouritesProvider><EventsPage /></FavouritesProvider>),},
          { path: "dashboard", element: <DashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "contact", element: <ContactPage /> },
          { path: "about", element: <AboutPage /> }, 
        ],
      },
    ],
  },
]);
