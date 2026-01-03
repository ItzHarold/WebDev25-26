import { useState } from "react";
import "./CreateTeamForm.css";
import { useAuth } from "../../../features/auth/AuthProvider";
import { createTeam } from "../../../shared/api/teamApi";


type Props = {
  onCreated: () => void;
};

export default function CreateTeamForm({ onCreated }: Props) {
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      await createTeam({
        description,
        imageUrl: imageUrl.trim() ? imageUrl : undefined,
        managerId: user.userId,
      });
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

return (
  <form className="create-team-form" onSubmit={submit}>
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
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
    </label>

    {error && <div className="error">{error}</div>}

    <button type="submit" disabled={loading}>
      {loading ? "Creating..." : "Create team"}
    </button>
  </form>
);

}
