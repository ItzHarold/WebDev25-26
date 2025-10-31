import type { TeamEntry, Tournament } from "../../pages/Dashboard/types";

export default function ViewTournament({ t, approved, onRemove }: { t: Tournament; approved: TeamEntry[]; onRemove: (id: string) => void }) {
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
