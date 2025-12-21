import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import "./AppLayout.css";
import "../../pages/Login/LoginPage.css";
import UserMenu from "./UserMenu";



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
            <li className="topbar__spacer" />
            <li><UserMenu /></li>
          </ul>
        </nav>
      </header>
      <main className="main" id="main"><Outlet /></main>

    </>
  )
}