// ===============================================
// src/components/UserMenu.tsx
// Role-based dropdown menu
// ===============================================

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!open) return;
            const t = e.target as Node;
            if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/Home");
    };

    return (
        <div className="user-menu">
            <button
                ref={btnRef}
                className="avatar-btn"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" fill="currentColor" />
                    <path
                        d="M4 20c0-4 4-6 8-6s8 2 8 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>

            {open && (
                <div ref={menuRef} className="menu" role="menu">
                    {!user ? (
                        <>
                            <Link
                                to="/Login"
                                role="menuitem"
                                className="menu-item"
                                onClick={() => setOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/Register"
                                role="menuitem"
                                className="menu-item"
                                onClick={() => setOpen(false)}
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* ================= USER ================= */}
                            {hasRole("user") && (
                                <>
                                    <Link
                                        to="/profile"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    <div className="menu-sep" aria-hidden="true"></div>

                                    <Link
                                        to="/about"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link
                                        to="/contact"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Contact
                                    </Link>

                                    <div className="menu-sep" aria-hidden="true"></div>

                                    <button
                                        role="menuitem"
                                        className="menu-item logout"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                </>
                            )}

                            {/* ================= MANAGER ================= */}
                            {hasRole("manager") && (
                                <>
                                    <Link
                                        to="/profile"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    <div className="menu-sep" aria-hidden="true"></div>

                                    <Link
                                        to="/manager"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Teams
                                    </Link>
                                    <Link
                                        to="/manager/events"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Events
                                    </Link>

                                    <div className="menu-sep" aria-hidden="true"></div>

                                    <Link
                                        to="/about"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link
                                        to="/contact"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Contact
                                    </Link>

                                    <div className="menu-sep" aria-hidden="true"></div>

                                    <button
                                        role="menuitem"
                                        className="menu-item logout"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                </>
                            )}

                            {/* ================= ADMIN ================= */}
                            {hasRole("admin") && (
                                <>
                                    <Link
                                        to="/profile"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    <div className="menu-sep" aria-hidden="true"></div>

                                    <Link
                                        to="/about"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link
                                        to="/contact"
                                        role="menuitem"
                                        className="menu-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Contact
                                    </Link>

                                    <div className="menu-sep" aria-hidden="true"></div>

                                    <button
                                        role="menuitem"
                                        className="menu-item logout"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
