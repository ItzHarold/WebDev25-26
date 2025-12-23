import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__brand" aria-label="Application info">
          <Link to="/" className="footer__logo">
            WebDev25
          </Link>
          <p className="footer__tagline">
            Esports Team Management Application
          </p>
        </section>

        <nav className="footer__nav" aria-label="Footer navigation">
          <div className="footer__col">
            <h2 className="footer__heading">Explore</h2>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/favourites">Favourites</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Info</h2>
            <ul className="footer__list">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} WebDev25 | Built with React + ASP.NET. Secured auth with JWT.</p>
      </div>
    </footer>
  );
}
