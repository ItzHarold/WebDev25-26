import React from "react";

interface TournamentDetailsProps {
  tournament: any;
  teams: any[];
  onClose: () => void;
  onDisqualifyTeam: (teamId: string) => void;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ tournament, teams, onClose, onDisqualifyTeam }) => {
  const participatingTeams = teams.filter((team) =>
    tournament.participatingTeams?.includes(team.id)
  );

  return (
    <div className="tournament-details-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{tournament.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="details-content">
          <div className="details-section">
            <h3>Event Information</h3>
            <div className="info-grid">
              <div className="info-item"><strong>Location:</strong><span>{tournament.location}</span></div>
              <div className="info-item"><strong>Status:</strong><span className={`status-badge status-${tournament.status}`}>{tournament.status}</span></div>
              <div className="info-item"><strong>Date:</strong><span>{tournament.date}</span></div>
              <div className="info-item"><strong>Max Teams:</strong><span>{tournament.maxTeams}</span></div>
              <div className="info-item"><strong>Registered:</strong><span>{participatingTeams.length}/{tournament.maxTeams}</span></div>
            </div>
            <div className="description"><strong>Description:</strong><p>{tournament.description}</p></div>
            <div className="description"><strong>Details:</strong><p>{tournament.detail}</p></div>
          </div>
          <div className="details-section">
            <h3>Participating Teams ({participatingTeams.length})</h3>
            {participatingTeams.length === 0 ? (
              <p className="no-teams">No teams participating yet</p>
            ) : (
              <div className="teams-list">
                {participatingTeams.map((team) => (
                  <div key={team.id} className="team-item">
                    <div className="team-info">
                      <h4>{team.name}</h4>
                      <p><strong>Game:</strong> {team.game}</p>
                      <p><strong>Players:</strong> {team.players}</p>
                    </div>
                    <button 
                      className="btn-disqualify" 
                      onClick={() => onDisqualifyTeam(team.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
