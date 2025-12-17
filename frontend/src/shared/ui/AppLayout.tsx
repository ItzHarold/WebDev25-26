import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import "./AppLayout.css";

export default function AppLayout() { 
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", {replace: true});
  }

  return(
    <>
      <header className="topbar">
        <nav className="topbar_nav" aria-label="Main navigation">
          <a className="topbar_brand" href="/">WebDev25Logo</a>

          <ul className="topbar_links">
            <li> <NavLink to="/">Home</NavLink> </li>
            <li className="topbar__spacer" />
            <li> <NavLink to="/events">Events</NavLink> </li>
            <li className="topbar__spacer" />
            <li> <NavLink to="/dashboard">Dashboard</NavLink> </li>
            <li className="topbar__spacer" />
            <li> <button type="button" className="topbar_logout" onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <main className="main" id="main"><Outlet /></main>

    </>
  )
}