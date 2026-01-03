import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import "./UserMenu.css";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const nav = useNavigate();

  const { user, logout } = useAuth();
  const role = user?.role;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        btnRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const close = () => setOpen(false);

  const onLogout = () => {
    logout();
    close();
    nav("/login", { replace: true });
  };

  return (
    <div className="user-menu">
      <button
        ref={btnRef}
        className="user-menu__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="user-menu__avatar">👤</span>
      </button>

      {open && (
        <div ref={menuRef} className="user-menu__panel" role="menu">
          {/* Everyone */}
          <Link to="/profile" role="menuitem" className="user-menu__item" onClick={close}>
            Profile
          </Link>

          <div className="user-menu__sep" />


          {/* admin only */}
          {role === "admin" && (
            <>
              <Link to="/dashboard" role="menuitem" className="user-menu__item" onClick={close}>
                Dashboard  
              </Link>
            </> 
          )}

          {/* player only */}
          {(role === "player" || role === "manager") && (        
            <>
              <Link to="/team" role="menuitem" className="user-menu__item" onClick={close}>
                Team
              </Link>
            </>
          )}

          <Link to="/favourites" role="menuitem" className="user-menu__item" onClick={close}>
            Favourites
          </Link>

          <div className="user-menu__sep" />

          {/* Everyone */}
          <Link to="/about" role="menuitem" className="user-menu__item" onClick={close}>
            About
          </Link>
          <Link to="/contact" role="menuitem" className="user-menu__item" onClick={close}>
            Contact
          </Link>

          <div className="user-menu__sep" />

          <button
            role="menuitem"
            className="user-menu__item user-menu__logout"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
