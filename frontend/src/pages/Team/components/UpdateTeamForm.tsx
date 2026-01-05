import { useEffect, useState } from "react";
import "./TeamForm.css";
import type { Team } from "../../../shared/types/Team";
import { updateTeam } from "../../../shared/api/teamApi";
import { useAuth } from "../../../features/auth/AuthProvider";
import { uploadTeamImage } from "../../../shared/api/teamApi";
import ImageUploadForm from "../../../shared/ui/ImageUploadForm";

type Props = {
  team: Team;
  onUpdated: () => void;
  onCancel: () => void;
};

export default function UpdateTeamForm({ team, onUpdated, onCancel }: Props) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState(team.description ?? "");
  const [imageUrl, setImageUrl] = useState(team.imageUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDescription(team.description ?? "");
    setImageUrl(team.imageUrl ?? "");
  }, [team.id, team.description, team.imageUrl]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user?.userId) {
      setError("No userId found.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setLoading(true);
      await updateTeam(team.id, {
        description: description.trim(),
        imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
        points: team.points,
        managerId: team.managerId,
      });
      
      if (selectedFile) {
        await uploadTeamImage(team.id, selectedFile);
      }
      
      onUpdated();
    } catch (err: any) {
      setError(err.message || "Failed to update team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="team-form" onSubmit={submit}>
      <h2>Update Team</h2>

      <label>
        Team Name:
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
      Image URL (optional)
      <ImageUploadForm
        label="Team Image"
        imageUrl={imageUrl}
        onFileChange={setSelectedFile}
      />
    </label>

      {error && <div className="team-form-error">{error}</div>}

      <div className="team-form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          className="team-btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
