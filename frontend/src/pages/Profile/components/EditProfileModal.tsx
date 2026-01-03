import { useState, useEffect } from "react";
import { updateUser, uploadProfilePicture } from "../../../shared/api/userApi";

import type { User, UpdateUserRequest } from "../../../shared/types/User";
import "../../../shared/ui/Modal.css";

interface EditProfileModalProps {
    profile: User;
    onClose: () => void;
    onSave: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSave }) => {
    const [formData, setFormData] = useState<UpdateUserRequest>({
        role: "",
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        dob: "",
        teamId: null,
        imageUrl: null,
    });
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        setFormData({
            role: profile.role,
            firstName: profile.firstName,
            lastName: profile.lastName,
            userName: profile.userName,
            email: profile.email,
            password: "",
            dob: profile.dob.split("T")[0],
            teamId: profile.teamId,
            imageUrl: profile.imageUrl,
        });
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.password) {
            setError("Please enter your password to confirm changes");
            return;
        }

        try {
            setSaving(true);
            let imageUrl = formData.imageUrl;
            if (selectedFile) {
                const result = await uploadProfilePicture(profile.id, selectedFile);
                imageUrl = result.imageUrl;
            }
            await updateUser(profile.id, { ...formData, imageUrl });
            onSave();
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
            <article className="modal">
                <header className="modal__header">
                    <h2 className="modal__title" id="edit-profile-title">Edit Profile</h2>
                    <button className="modal__close" onClick={onClose} aria-label="Close modal">×</button>
                </header>

                <form onSubmit={handleSubmit} className="modal__body">
                    {error && <p className="form-error" role="alert">{error}</p>}

                    <fieldset className="form-group">
                        <label className="form-label" htmlFor="firstName">First Name *</label>
                        <input
                            className="form-input"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <label className="form-label" htmlFor="lastName">Last Name *</label>
                        <input
                            className="form-input"
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <label className="form-label" htmlFor="userName">Username *</label>
                        <input
                            className="form-input"
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <label className="form-label" htmlFor="email">Email *</label>
                        <input
                            className="form-input"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <label className="form-label" htmlFor="dob">Date of Birth *</label>
                        <input
                            className="form-input"
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <label className="form-label" htmlFor="profilePicture">Profile Picture</label>
                        <input
                            className="form-input"
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <label className="form-label" htmlFor="password">Current Password (required to save) *</label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <footer className="form-actions">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </footer>
                </form>
            </article>
        </div>
    );
};

export default EditProfileModal;