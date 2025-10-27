import type { Tournament } from "../../pages/Dashboard/types";

export default function EditTournament({ t, onSave }: { t: Tournament; onSave: (t: Tournament) => void }) {
  const [form, setForm] = useState<Tournament>({ ...t });
  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h3>Edit Tournament</h3>
      <label>
        Name
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </label>
      <label>
        Game
        <input value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} required />
      </label>
      <label>
        Status
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as Tournament["status"] })}
        >
          <option>Registration Open</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </label>
      <label>
        Max Teams
        <input type="number" min={2} max={256} value={form.maxTeams} onChange={(e) => setForm({ ...form, maxTeams: Number(e.target.value) })} />
      </label>
      <label>
        Start Date
        <input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
      </label>
      <div className="btn-row">
        <button type="submit" className="create-btn">Save</button>
      </div>
    </form>
  );
}

import { useState } from "react";
