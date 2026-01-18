import { Outlet } from "react-router-dom";
import "./AppLayout.css";
import Footer from "./Footer";
import "../../pages/Login/LoginPage.css";
import UserMenu from "./UserMenu";



export default function AppLayout() {

  return(
    <>
      <header className="topbar">
        <nav className="topbar_nav" aria-label="Main navigation">
          <a className="topbar_brand" href="/" aria-label="Home">
            <img src="/trophy.svg" alt="" width="28" height="28" />
          </a>
          <ul className="topbar_links">
            <li className="topbar__spacer" />
            <li><UserMenu /></li>
          </ul>
        </nav>
      </header>
      <main className="main" id="main"><Outlet /></main>
      <Footer/>

    </>
  )
}