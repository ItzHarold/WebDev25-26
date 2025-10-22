// ===============================================
// src/pages/LoginPage.tsx
// Dev-only role buttons + use destinationFor() + loading-safe
// ===============================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import type { Role } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
    const { login, destinationFor } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const handleDevLogin = (role: Role) => {
        login({
            id: crypto.randomUUID(),
            email: email || `${role}@test.com`,
            role,
        });
        navigate(destinationFor(role));
    };

    const handleSubmit = () => {
        // placeholder for real backend login later
        const role: Role = "user";
        login({
            id: crypto.randomUUID(),
            email: email || "user@test.com",
            role,
        });
        navigate(destinationFor(role));
    };

    return (
        <>
            <section className="hero">
                <h1>Login</h1>
            </section>

            <main className="card">
                <div className="stack">
                    <label className="input">
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label className="input" style={{ paddingRight: 130 }}>
                        <input
                            type={showPwd ? "text" : "password"}
                            placeholder="Enter password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                        />
                        <button
                            type="button"
                            className="pill-toggle"
                            onClick={() => setShowPwd((v) => !v)}
                        >
                            {showPwd ? "hide" : "show"}
                        </button>
                    </label>

                    <div className="row">
                        <button className="btn" type="button" onClick={handleSubmit}>
                            Submit
                        </button>
                        <Link to="/Register" className="muted">
                            No account? Click here to register
                        </Link>
                    </div>

                    {import.meta.env.DEV && (
                        <div className="row" style={{ marginTop: 16, flexWrap: "wrap", gap: 10 }}>
                            <button className="btn" type="button" onClick={() => handleDevLogin("user")}>
                                ▶︎ Dev: Login as User
                            </button>
                            <button className="btn" type="button" onClick={() => handleDevLogin("manager")}>
                                ▶︎ Dev: Login as Manager
                            </button>
                            <button className="btn" type="button" onClick={() => handleDevLogin("admin")}>
                                ▶︎ Dev: Login as Admin
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default LoginPage;
