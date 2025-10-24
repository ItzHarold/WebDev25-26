import { useEffect, useMemo, useState } from "react";

type Tournament = {
    id: string;
    name: string;
    game: string;
    status: "Registration Open" | "Ongoing" | "Completed" | "Cancelled";
    currentTeams: number; // e.g. 3
    maxTeams: number; // e.g. 16
    startDate: string; // display string
};

// Represents a team requesting or participating in a tournament
export type TeamEntry = {
    id: string;
    teamName: string;
    tournament: string;
    players: number;
    status: "Pending" | "Approved" | "Rejected" | "Resigned";
};

const INITIAL_TOURNAMENTS: Tournament[] = [
    { id: "t1", name: "CS2 Global Championship 2025", game: "Counter-Strike 2", status: "Registration Open", currentTeams: 1, maxTeams: 32, startDate: "3/15/2025" },
    { id: "t2", name: "VALORANT Champions Tour", game: "VALORANT", status: "Completed", currentTeams: 32, maxTeams: 32, startDate: "4/01/2025" },
    { id: "t3", name: "Arena Clash - Spring Cup", game: "Arena FPS", status: "Ongoing", currentTeams: 8, maxTeams: 64, startDate: "9/05/2025" },
    { id: "t4", name: "Rocket Rumble Invitational", game: "Rocket League", status: "Registration Open", currentTeams: 3, maxTeams: 16, startDate: "10/12/2025" },
    { id: "t5", name: "Super Smash Showdown", game: "Super Smash Bros", status: "Completed", currentTeams: 16, maxTeams: 16, startDate: "2/20/2025" },
    { id: "t6", name: "Indie Cup: Open Qualifiers", game: "Various", status: "Cancelled", currentTeams: 0, maxTeams: 64, startDate: "5/01/2025" },
    { id: "t7", name: "LAN Heroes - Autumn League", game: "Multiple", status: "Registration Open", currentTeams: 12, maxTeams: 24, startDate: "11/18/2025" },
];

function classForStatus(s: Tournament["status"]) {
    const key = s.toLowerCase();
    if (key.includes("completed")) return "status-pill status-completed";
    if (key.includes("ongoing")) return "status-pill status-ongoing";
    if (key.includes("cancel")) return "status-pill status-cancelled";
    return "status-pill status-open";
}

type TabKey = "tournaments" | "teams" | "rooms" | "settings";

export default function DashboardPage() {
    const [tab, setTab] = useState<TabKey>("tournaments");
    const [items, setItems] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
    const [query, setQuery] = useState("");

    // --- Team Entries (approvals) ---
    const [teamQuery, setTeamQuery] = useState("");
    const [entries, setEntries] = useState<TeamEntry[]>([
        { id: "e1", teamName: "Alpha Wolves", tournament: "CS2 Global Championship 2025", players: 5, status: "Pending" },
        { id: "e2", teamName: "Rocket Riders", tournament: "Rocket Rumble Invitational", players: 3, status: "Approved" },
        { id: "e3", teamName: "Valor Vipers", tournament: "VALORANT Champions Tour", players: 5, status: "Rejected" },
        { id: "e4", teamName: "LAN Legends", tournament: "LAN Heroes - Autumn League", players: 4, status: "Pending" },
    ]);
    const filteredEntries = useMemo<TeamEntry[]>(() => {
        const q = teamQuery.trim().toLowerCase();
        if (!q) return entries;
        return entries.filter((e: TeamEntry) =>
            [e.teamName, e.tournament, e.status].join(" ").toLowerCase().includes(q)
        );
    }, [entries, teamQuery]);
    const findTournamentIndexByName = (name: string) => items.findIndex(t => t.name === name);
    const incrementTeamCount = (tournamentName: string): boolean => {
        const idx = findTournamentIndexByName(tournamentName);
        if (idx === -1) return false;
        const t = items[idx];
        if (t.currentTeams >= t.maxTeams) return false;
        const updated = { ...t, currentTeams: t.currentTeams + 1 };
        setItems((prev) => prev.map((x, i) => i === idx ? updated : x));
        return true;
    };
    const decrementTeamCount = (tournamentName: string) => {
        const idx = findTournamentIndexByName(tournamentName);
        if (idx === -1) return;
        const t = items[idx];
        const next = Math.max(0, t.currentTeams - 1);
        if (next === t.currentTeams) return;
        const updated = { ...t, currentTeams: next };
        setItems((prev) => prev.map((x, i) => i === idx ? updated : x));
    };

    const approveEntry = (id: string) => {
        setEntries((prev) => {
            const e = prev.find(p => p.id === id);
            if (!e) return prev;
            if (e.status === "Approved") return prev; // nothing to do
            const ok = incrementTeamCount(e.tournament);
            if (!ok) {
                setTeamNotice("Tournament is full. Increase Max Teams or choose another.");
                return prev;
            }
            return prev.map((x) => x.id === id ? { ...x, status: "Approved" as const } : x);
        });
    };

    const rejectEntry = (id: string) => {
        setEntries((prev) => {
            const e = prev.find(p => p.id === id);
            if (!e) return prev;
            if (e.status === "Approved") decrementTeamCount(e.tournament);
            return prev.map((x) => x.id === id ? { ...x, status: "Rejected" as const } : x);
        });
    };

    const resignEntry = (id: string) => {
        setEntries((prev) => {
            const e = prev.find(p => p.id === id);
            if (!e) return prev;
            if (e.status === "Approved") decrementTeamCount(e.tournament);
            return prev.map((x) => x.id === id ? { ...x, status: "Resigned" as const } : x);
        });
    };

    const removeEntry = (id: string) => {
        setEntries((prev) => {
            const e = prev.find(p => p.id === id);
            if (e && e.status === "Approved") decrementTeamCount(e.tournament);
            return prev.filter((x) => x.id !== id);
        });
    };

    const bulkApprovePending = () => {
        setEntries((prev) => {
            let approved = 0;
            let skipped = 0;
            const next = prev.map((e) => {
                if (e.status !== "Pending") return e;
                const ok = incrementTeamCount(e.tournament);
                if (ok) {
                    approved++;
                    return { ...e, status: "Approved" as const };
                } else {
                    skipped++;
                    return e;
                }
            });
            if (approved || skipped) setTeamNotice(`Approved ${approved} pending; ${skipped} skipped (full).`);
            return next;
        });
    };

    // --- Rooms & Servers ---
    type Room = { id: string; name: string; type: "LAN" | "Online"; capacity: number; active: boolean };
    const [rooms, setRooms] = useState<Room[]>([
        { id: "r1", name: "LAN Room A", type: "LAN", capacity: 16, active: true },
        { id: "r2", name: "EU-1", type: "Online", capacity: 64, active: true },
        { id: "r3", name: "NA-1", type: "Online", capacity: 64, active: false },
    ]);
    const toggleRoom = (id: string) => setRooms((prev: Room[]) => prev.map((r: Room) => r.id === id ? { ...r, active: !r.active } : r));
    const saveRoom = (room: Room) => setRooms((prev: Room[]) => prev.map((r: Room) => r.id === room.id ? room : r));
    const createRoom = (room: Omit<Room, "id">) => setRooms((prev: Room[]) => [{ id: `r${Math.random().toString(36).slice(2, 9)}`, ...room }, ...prev]);
    const deleteRoom = (id: string) => setRooms((prev: Room[]) => prev.filter((r: Room) => r.id !== id));

    // Settings tab intentionally empty (to be filled) !!!!!!

    const [modal, setModal] = useState<
        | null
        | { type: "view" | "edit" | "create"; item?: Tournament }
        | { type: "room-edit"; room: Room }
        | { type: "room-create" }
    >(null);
    const [teamNotice, setTeamNotice] = useState<string>("");
    useEffect(() => {
        if (!teamNotice) return;
        const id = setTimeout(() => setTeamNotice(""), 2500);
        return () => clearTimeout(id);
    }, [teamNotice]);

    const filtered = useMemo<Tournament[]>(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((t: Tournament) =>
            [t.name, t.game, t.status].join(" ").toLowerCase().includes(q)
        );
    }, [items, query]);

    function onCreate(newItem: Omit<Tournament, "id">) {
        const id = `t${Math.random().toString(36).slice(2, 9)}`;
        setItems((prev: Tournament[]) => [{ id, ...newItem }, ...prev]);
        setModal(null);
    }

    function onUpdate(updated: Tournament) {
        setItems((prev: Tournament[]) => prev.map((t: Tournament) => (t.id === updated.id ? updated : t)));
        setModal(null);
    }

    function onDelete(id: string) {
        setItems((prev: Tournament[]) => prev.filter((t: Tournament) => t.id !== id));
    }

    return (
        <main className="container">
            {/* Hero */}
            <section className="hero hero--dash">
                <div className="hero-content">
                    <h1>Admin Dashboard</h1>
                    <p>Manage tournaments, teams, and system settings</p>
                </div>
            </section>

            {/* Stats */}
            <section className="dashboard">
                <div className="stat-grid">
                    <div className="stat-card">
                        <div className="stat-title">Active Tournaments</div>
                        <div className="stat-value">{items.filter(i => i.status === "Ongoing" || i.status === "Registration Open").length}</div>
                        <div className="stat-sub">sample data</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Completed</div>
                        <div className="stat-value">{items.filter(i => i.status === "Completed").length}</div>
                        <div className="stat-sub">historical</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Total Rooms</div>
                        <div className="stat-value">2</div>
                        <div className="stat-sub">LAN and Online</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">This Month</div>
                        <div className="stat-value">5</div>
                        <div className="stat-sub">scheduled events</div>
                    </div>
                </div>

                {/* Management header */}
                <div className="management-header">
                    <div className="tabs">
                        <button className="tab" aria-pressed={tab === "tournaments"} onClick={() => setTab("tournaments")}>Tournaments</button>
                        <button className="tab" aria-pressed={tab === "teams"} onClick={() => setTab("teams")}>Team Entries</button>
                        <button className="tab" aria-pressed={tab === "rooms"} onClick={() => setTab("rooms")}>Rooms & Servers</button>
                        <button className="tab" aria-pressed={tab === "settings"} onClick={() => setTab("settings")}>Settings</button>
                    </div>
                    {tab === "tournaments" && (
                        <div className="management-actions">
                            <input
                                id="tournament-search"
                                className="tournament-search"
                                type="search"
                                placeholder="Search tournaments, games, status..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button className="create-btn" onClick={() => setModal({ type: "create" })}>+ Create Tournament</button>
                        </div>
                    )}
                    {tab === "teams" && (
                        <div className="management-actions">
                            <input
                                className="tournament-search"
                                type="search"
                                placeholder="Search teams, tournaments, status..."
                                value={teamQuery}
                                onChange={(e) => setTeamQuery(e.target.value)}
                            />
                            <button className="create-btn" onClick={bulkApprovePending}>Approve All Pending</button>
                            {teamNotice && <small>{teamNotice}</small>}
                        </div>
                    )}
                    {tab === "rooms" && (
                        <div className="management-actions">
                            <button className="create-btn" onClick={() => setModal({ type: "room-create" })}>+ Add Room/Server</button>
                        </div>
                    )}
                </div>

                {tab === "tournaments" && (
                    <>
                        <h3>Tournament Management</h3>
                        <div className="tournaments-panel">
                            <table className="tournaments-table">
                                <thead>
                                    <tr>
                                        <th>Tournament</th>
                                        <th>Game</th>
                                        <th>Status</th>
                                        <th>Teams</th>
                                        <th>Start Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((t) => (
                                        <tr key={t.id}>
                                            <td>{t.name}</td>
                                            <td>{t.game}</td>
                                            <td>
                                                <span className={classForStatus(t.status)}>{t.status}</span>
                                            </td>
                                            <td>{t.currentTeams}/{t.maxTeams}</td>
                                            <td>{t.startDate}</td>
                                            <td>
                                                <button className="link-btn" onClick={() => setModal({ type: "view", item: t })}>View</button>
                                                <span aria-hidden> · </span>
                                                <button className="link-btn" onClick={() => setModal({ type: "edit", item: t })}>Edit</button>
                                                <span aria-hidden> · </span>
                                                <button className="link-btn danger" onClick={() => onDelete(t.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {tab === "teams" && (
                    <>
                        <h3>Team Entries</h3>
                        <div className="tournaments-panel">
                            <table className="tournaments-table">
                                <thead>
                                    <tr>
                                        <th>Team</th>
                                        <th>Tournament</th>
                                        <th>Players</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEntries.map((e: TeamEntry) => (
                                        <tr key={e.id}>
                                            <td>{e.teamName}</td>
                                            <td>{e.tournament}</td>
                                            <td>{e.players}</td>
                                            <td>
                                                <span className={`status-pill ${
                                                    e.status === "Approved" ? "status-approved" : e.status === "Rejected" ? "status-cancelled" : e.status === "Resigned" ? "status-resigned" : "status-ongoing"
                                                }`}>{e.status}</span>
                                            </td>
                                            <td>
                                                {e.status !== "Approved" && (
                                                    <>
                                                        <button className="link-btn" onClick={() => approveEntry(e.id)}>Approve</button>
                                                        <span aria-hidden> · </span>
                                                    </>
                                                )}
                                                {e.status !== "Rejected" && (
                                                    <>
                                                        <button className="link-btn danger" onClick={() => rejectEntry(e.id)}>Reject</button>
                                                        <span aria-hidden> · </span>
                                                    </>
                                                )}
                                                {e.status === "Approved" && (
                                                    <>
                                                        <button className="link-btn" onClick={() => resignEntry(e.id)}>Mark Resigned</button>
                                                        <span aria-hidden> · </span>
                                                    </>
                                                )}
                                                <button className="link-btn danger" onClick={() => removeEntry(e.id)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {tab === "rooms" && (
                    <>
                        <h3>Rooms & Servers</h3>
                        <div className="tournaments-panel">
                            <table className="tournaments-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Capacity</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((r: Room) => (
                                        <tr key={r.id}>
                                            <td>{r.name}</td>
                                            <td>{r.type}</td>
                                            <td>{r.capacity}</td>
                                            <td>
                                                <span className={`status-pill ${r.active ? "status-open" : "status-completed"}`}>{r.active ? "Active" : "Disabled"}</span>
                                            </td>
                                            <td>
                                                <button className="link-btn" onClick={() => toggleRoom(r.id)}>{r.active ? "Disable" : "Enable"}</button>
                                                <span aria-hidden> · </span>
                                                <button className="link-btn" onClick={() => setModal({ type: "room-edit", room: r })}>Edit</button>
                                                <span aria-hidden> · </span>
                                                <button className="link-btn danger" onClick={() => deleteRoom(r.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {tab === "settings" && (
                    <section className="placeholder">
                        <p>To be implemented.</p>
                    </section>
                )}
            </section>

            {/* Simple modal */}
            {modal && (
                <Modal onClose={() => setModal(null)}>
                    {modal.type === "view" && modal.item && (
                        <ViewTournament
                            t={modal.item}
                            approved={entries.filter((e) => e.tournament === modal.item!.name && e.status === "Approved")}
                            onRemove={(id) => resignEntry(id)}
                        />
                    )}
                    {modal.type === "edit" && modal.item && (
                        <EditTournament t={modal.item} onSave={onUpdate} />
                    )}
                    {modal.type === "create" && (
                        <CreateTournament onCreate={onCreate} />
                    )}
                    {modal.type === "room-edit" && (
                        <EditRoom room={modal.room} onSave={(r) => { saveRoom(r); setModal(null); }} />
                    )}
                    {modal.type === "room-create" && (
                        <CreateRoom onCreate={(r) => { createRoom(r); setModal(null); }} />
                    )}
                </Modal>
            )}
        </main>
    );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
                {children}
            </div>
        </div>
    );
}

function ViewTournament({ t, approved, onRemove }: { t: Tournament; approved: TeamEntry[]; onRemove: (id: string) => void }) {
    return (
        <div>
            <h3>{t.name}</h3>
            <p><strong>Game:</strong> {t.game}</p>
            <p><strong>Status:</strong> {t.status}</p>
            <p><strong>Teams:</strong> {t.currentTeams}/{t.maxTeams}</p>
            <p><strong>Start:</strong> {t.startDate}</p>

            <h4 style={{ marginTop: ".75rem" }}>Joined Teams</h4>
            {approved.length === 0 ? (
                <p>No approved teams yet.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {approved.map((e) => (
                        <li key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".25rem 0" }}>
                            <span>{e.teamName} <small>({e.players} players)</small></span>
                            <button className="link-btn danger" onClick={() => onRemove(e.id)}>Remove from event</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function EditTournament({ t, onSave }: { t: Tournament; onSave: (t: Tournament) => void }) {
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

function CreateTournament({ onCreate }: { onCreate: (t: Omit<Tournament, "id" | "currentTeams"> & { currentTeams: number }) => void }) {
    const [form, setForm] = useState<Omit<Tournament, "id" | "currentTeams"> & { currentTeams: number }>({
        name: "",
        game: "",
        status: "Registration Open",
        currentTeams: 0,
        maxTeams: 16,
        startDate: "",
    });
    return (
        <form
            className="form-grid"
            onSubmit={(e) => {
                e.preventDefault();
                onCreate(form);
            }}
        >
            <h3>Create Tournament</h3>
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
                <button type="submit" className="create-btn">Create</button>
            </div>
        </form>
    );
}

function EditRoom({ room, onSave }: { room: { id: string; name: string; type: "LAN" | "Online"; capacity: number; active: boolean }; onSave: (r: { id: string; name: string; type: "LAN" | "Online"; capacity: number; active: boolean }) => void }) {
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
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "LAN" | "Online" })}>
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

function CreateRoom({ onCreate }: { onCreate: (r: { name: string; type: "LAN" | "Online"; capacity: number; active: boolean }) => void }) {
    const [form, setForm] = useState<{ name: string; type: "LAN" | "Online"; capacity: number; active: boolean }>({ name: "", type: "LAN", capacity: 16, active: true });
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
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "LAN" | "Online" })}>
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
