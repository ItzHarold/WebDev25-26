import type { Room } from "../../pages/Dashboard/types";
import { useState } from "react";

export default function CreateRoom({ onCreate }: { onCreate: (r: Omit<Room, "id">) => void }) {
  const [form, setForm] = useState<Omit<Room, "id">>({ name: "", type: "LAN", capacity: 16, active: true });
  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(form);
      }}
    >
      <h3>Add Room/Server</h3>
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
        <button type="submit" className="create-btn">Create</button>
      </div>
    </form>
  );
}
