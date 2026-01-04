import { useState } from "react";
import "./CreateTeamForm.css";
import { useAuth } from "../../../features/auth/AuthProvider";
import { createTeam } from "../../../shared/api/teamApi";
import { uploadTeamImage } from "../../../shared/api/teamApi";
import ImageUploadForm from "../../../shared/ui/ImageUploadForm";

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
        imageUrl: null,
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
      <ImageUploadForm
        label="Team Image"
        imageUrl={imageUrl}
        onFileChange={setSelectedFile}
      />
    </label>

    {error && <div className="error">{error}</div>}

    <button type="submit" disabled={loading}>
      {loading ? "Creating..." : "Create team"}
    </button>
  </form>
);

}
