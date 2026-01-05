import { useState } from "react";
import { changePassword } from "../../../shared/api/userApi";
import "../../../shared/ui/Modal.css";

interface ChangePasswordModalProps {
    userId: number;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ userId, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        try {
            setSaving(true);
            await changePassword({
                userId,
                currentPassword,
                newPassword,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
            <article className="modal">
                <header className="modal__header">
                    <h2 className="modal__title" id="change-password-title">Change Password</h2>
                    <button className="modal__close" onClick={onClose} aria-label="Close modal">×</button>
                </header>

                <section className="modal__body">
                    {success ? (
                        <>
                            <p className="form-success" role="status">Password changed successfully!</p>
                            <footer className="form-actions">
                                <button type="button" className="btn btn--primary" onClick={onClose}>
                                    Close
                                </button>
                            </footer>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && <p className="form-error" role="alert">{error}</p>}

                            <fieldset className="form-group">
                                <label className="form-label" htmlFor="currentPassword">Current Password *</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </fieldset>

                            <fieldset className="form-group">
                                <label className="form-label" htmlFor="newPassword">New Password *</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </fieldset>

                            <fieldset className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirm New Password *</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </fieldset>

                            <footer className="form-actions">
                                <button type="button" className="btn btn--secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn--primary" disabled={saving}>
                                    {saving ? "Changing..." : "Change Password"}
                                </button>
                            </footer>
                        </form>
                    )}
                </section>
            </article>
        </div>
    );
};

export default ChangePasswordModal;