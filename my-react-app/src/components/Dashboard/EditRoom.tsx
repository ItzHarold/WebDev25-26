import type { Room } from "../../pages/Dashboard/types";
import { useState } from "react";

export default function EditRoom({ room, onSave }: { room: Room; onSave: (r: Room) => void }) {
  const [form, setForm] = useState(room);
  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h3>Edit Room/Server</h3>
      <label>
        Name
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </label>
      <label>
        Type
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Room["type"] })}>
          <option>LAN</option>
          <option>Online</option>
        </select>
      </label>
      <label>
        Capacity
        <input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
      </label>
      <label>
        Active
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
      </label>
      <div className="btn-row">
        <button type="submit" className="create-btn">Save</button>
      </div>
    </form>
  );
}
