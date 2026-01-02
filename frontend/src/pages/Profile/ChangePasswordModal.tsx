import { useState } from "react";
import { changePassword } from "../../shared/api/userApi";
import "../../shared/ui/Modal.css";

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
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal__header">
                    <h2 className="modal__title">Change Password</h2>
                    <button className="modal__close" onClick={onClose}>×</button>
                </div>
                <div className="modal__body">
                    {success ? (
                        <>
                            <div className="form-success">Password changed successfully!</div>
                            <div className="form-actions">
                                <button type="button" className="btn btn--primary" onClick={onClose}>
                                    Close
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && <div className="form-error">{error}</div>}

                            <div className="form-group">
                                <label className="form-label" htmlFor="currentPassword">Current Password *</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="newPassword">New Password *</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirm New Password *</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn--secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn--primary" disabled={saving}>
                                    {saving ? "Changing..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;