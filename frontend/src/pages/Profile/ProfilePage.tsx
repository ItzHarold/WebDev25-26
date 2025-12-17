// ===============================================
// src/pages/Profile/ProfilePage.tsx
// ===============================================
import React from "react";
import { useAuth } from "../../features/auth/AuthProvider";

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1>My Profile</h1>
                </div>
            </section>

            <main className="card" style={{ maxWidth: 900, margin: "2rem auto" }}>
                <div className="profile-header">
                    <div className="avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="44" height="44">
                            <circle cx="12" cy="8" r="4" fill="currentColor" />
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="identity">
                        <div className="email">{user?.email ?? "—"}</div>
                        <span className="role-badge" data-role={user?.role ?? "player"}>
              {user?.role?.toUpperCase() ?? "PLAYER"}
            </span>
                    </div>
                </div>

                <div className="profile-grid">
                    <div className="field">
                        <div className="label">User ID</div>
                        <div className="value mono">{user?.userId ?? "—"}</div>
                    </div>
                    <div className="field">
                        <div className="label">Role</div>
                        <div className="value">{user?.role ?? "player"}</div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProfilePage;
