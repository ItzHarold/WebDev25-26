import React, { useState } from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import PageHero from "../../shared/ui/PageHero";
import { useFetchUser } from "../../shared/hooks/useFetchUser";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
    const { user: authUser } = useAuth();
    const { user: profile, loading, error, refetch } = useFetchUser(authUser?.userId ?? null);
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!profile) return <div className="error">No profile found</div>;

    return (
        <>
            <PageHero title="My Profile" subtitle="" backgroundImageUrl="HeroStock.jpg" />

            <main className="card" style={{ maxWidth: 900, margin: "2rem auto" }}>
                <div className="profile-header">
                    <div className="avatar" aria-hidden="true">
                        {profile.imageUrl ? (
                            <img src={profile.imageUrl} alt="Profile" />
                        ) : (
                            <svg viewBox="0 0 24 24" width="44" height="44">
                                <circle cx="12" cy="8" r="4" fill="currentColor" />
                                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>
                    <div className="identity">
                        <div className="name">{profile.firstName} {profile.lastName}</div>
                        <div className="email">{profile.email}</div>
                        <span className="role-badge" data-role={profile.role.toLowerCase()}>
                            {profile.role.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="profile-grid">
                    <div className="field">
                        <div className="label">Username</div>
                        <div className="value">@{profile.userName}</div>
                    </div>
                    <div className="field">
                        <div className="label">Date of Birth</div>
                        <div className="value">{new Date(profile.dob).toLocaleDateString()}</div>
                    </div>
                    <div className="field">
                        <div className="label">Member Since</div>
                        <div className="value">{new Date(profile.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="field">
                        <div className="label">Last Login</div>
                        <div className="value">
                            {profile.lastLoginAt 
                                ? new Date(profile.lastLoginAt).toLocaleDateString() 
                                : "—"}
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn-primary" onClick={() => setShowEditModal(true)}>
                        Edit Profile
                    </button>
                    <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
                        Change Password
                    </button>
                </div>
            </main>

            {showEditModal && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => {
                        setShowEditModal(false);
                        refetch();
                    }}
                />
            )}

            {showPasswordModal && (
                <ChangePasswordModal
                    userId={profile.id}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </>
    );
};

export default ProfilePage;