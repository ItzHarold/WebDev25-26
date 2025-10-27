import { useEffect, useMemo, useState } from "react";
import type { Tournament, TeamEntry, Room } from "./types";
import Modal from "../../components/Dashboard/Modal";
import ViewTournament from "../../components/Dashboard/ViewTournament";
import EditTournament from "../../components/Dashboard/EditTournament";
import CreateTournament from "../../components/Dashboard/CreateTournament";
import EditRoom from "../../components/Dashboard/EditRoom";
import CreateRoom from "../../components/Dashboard/CreateRoom";
import tournamentsData from "../../data/mockAdminTournaments.json";

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
    const [items, setItems] = useState<Tournament[]>(tournamentsData as unknown as Tournament[]);
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
