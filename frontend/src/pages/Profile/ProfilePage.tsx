import React, { useState } from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import PageHero from "../../shared/ui/PageHero";
import { useFetchUser } from "../../shared/hooks/useFetchUser";
import EditProfileModal from "./components/EditProfileModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
    const { user: authUser } = useAuth();
    const { user: profile, loading, error, refetch } = useFetchUser(authUser?.userId ?? null);
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const backendUrl = import.meta.env.VITE_API_URL;
    const getProfileImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith("http")) return imageUrl;
    return backendUrl + imageUrl;
    };
    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!profile) return <p className="error">No profile found</p>;

    return (
        <>
            <PageHero title="My Profile" subtitle="" backgroundImageUrl="HeroStock.jpg" />

            <section className="card" style={{ maxWidth: 900, margin: "2rem auto" }} aria-label="Profile information">
                <header className="profile-header">
                    <figure className="avatar" aria-hidden="true">
                        {profile.imageUrl ? (
                            <img src={getProfileImageUrl(profile.imageUrl)} alt="" />
                        ) : (
                            <svg viewBox="0 0 24 24" width="44" height="44">
                                <circle cx="12" cy="8" r="4" fill="currentColor" />
                                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </figure>
                    <div className="identity">
                        <h2 className="name">{profile.firstName} {profile.lastName}</h2>
                        <p className="email">{profile.email}</p>
                        <span className="role-badge" data-role={profile.role.toLowerCase()}>
                            {profile.role.toUpperCase()}
                        </span>
                    </div>
                </header>

                <dl className="profile-grid">
                    <div className="field">
                        <dt className="label">Username</dt>
                        <dd className="value">@{profile.userName}</dd>
                    </div>
                    <div className="field">
                        <dt className="label">Date of Birth</dt>
                        <dd className="value">{new Date(profile.dob).toLocaleDateString()}</dd>
                    </div>
                    <div className="field">
                        <dt className="label">Member Since</dt>
                        <dd className="value">{new Date(profile.createdAt).toLocaleDateString()}</dd>
                    </div>
                    <div className="field">
                        <dt className="label">Last Login</dt>
                        <dd className="value">
                            {profile.lastLoginAt 
                                ? new Date(profile.lastLoginAt).toLocaleDateString() 
                                : "—"}
                        </dd>
                    </div>
                </dl>

                <footer className="profile-actions">
                    <button className="btn-primary" onClick={() => setShowEditModal(true)}>
                        Edit Profile
                    </button>
                    <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
                        Change Password
                    </button>
                </footer>
            </section>

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