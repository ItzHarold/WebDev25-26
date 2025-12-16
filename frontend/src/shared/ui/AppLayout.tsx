import { Outlet, NavLink } from "react-router-dom";
import "./AppLayout.css";

export default function AppLayout() {
  return(
    <>
      <header className="topbar">
        <nav className="topbar_nav" aria-label="Main navigation">
          <a className="topbar_brand" href="/">WebDev25Logo</a>

          <ul className="topbar_links">
            <li> <NavLink to="/">Home</NavLink> </li>
            <li> <NavLink to="/events">Events</NavLink> </li>
          </ul>
        </nav>
      </header>

      <main className="main" id="main"><Outlet /></main>

    </>
  )
}