import { useState } from "react";
import { changePassword } from "../../shared/api/userApi";

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
        <div className="tournament-form-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Change Password</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {success ? (
                    <div className="tournament-form">
                        <div className="form-success">Password changed successfully!</div>
                        <div className="form-actions">
                            <button type="button" className="btn-save" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="tournament-form">
                        {error && <div className="form-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password *</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password *</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-save" disabled={saving}>
                                {saving ? "Changing..." : "Change Password"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordModal;