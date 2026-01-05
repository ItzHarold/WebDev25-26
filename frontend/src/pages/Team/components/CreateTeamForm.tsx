import { useState } from "react";
import "./TeamForm.css";
import { useAuth } from "../../../features/auth/AuthProvider";
import { createTeam } from "../../../shared/api/teamApi";

type Props = {
  onCreated: () => void;
};

export default function CreateTeamForm({ onCreated }: Props) {
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [imageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const newTeam = await createTeam({
        description,
        imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
        points: 0,
        managerId: user.userId,
      });
      if (selectedFile) {
        await uploadTeamImage(newTeam.id, selectedFile);
      }

      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="team-form" onSubmit={submit}>
      <h2>Create Team</h2>

      <label>
        Team Name:
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        Image URL (optional)
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </label>

      {error && <div className="team-form-error">{error}</div>}

      <div className="team-form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create team"}
        </button>
      </div>
    </form>
  );
}
