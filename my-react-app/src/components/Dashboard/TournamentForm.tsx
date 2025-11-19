import React, { useState, useEffect } from "react";

interface TournamentFormProps {
  tournament?: any;
  onSave: (event: any) => void;
  onCancel: () => void;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  tournament,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<any>({
    title: "",
    location: "",
    date: "",
    maxTeams: 8,
    status: "upcoming",
    description: "",
    detail: "",
    imageUrl: "",
    participatingTeams: [],
  });

  useEffect(() => {
    if (tournament) {
      setFormData(tournament);
    }
  }, [tournament]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "maxTeams" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tournament) {
      onSave({ ...formData, id: tournament.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="tournament-form-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{tournament ? "Edit Event" : "Create Event"}</h2>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="tournament-form">
          <div className="form-group">
            <label htmlFor="title">Event Name *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="e.g., June 20–22, 2025"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxTeams">Max Teams *</label>
            <input
              type="number"
              id="maxTeams"
              name="maxTeams"
              value={formData.maxTeams}
              onChange={handleChange}
              min="2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="detail">Full Details *</label>
            <textarea
              id="detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL *</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="/src/assets/tournament-image.png"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {tournament ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentForm;
