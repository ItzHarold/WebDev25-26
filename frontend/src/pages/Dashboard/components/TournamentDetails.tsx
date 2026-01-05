import React from "react";
import type { Event } from "../../../shared/types/Event";
import type { Team } from "../../../shared/types/Team";
import "./TournamentDetails.css";

type Tournament = Event & {
  participatingTeams: number[];
};

interface TournamentDetailsProps {
  tournament: Tournament;
  teams: Team[];
  onClose: () => void;
  onDisqualifyTeam: (teamId: number) => void;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ tournament, teams, onClose, onDisqualifyTeam }) => {
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
              <div className="info-item"><strong>Registered:</strong><span>{teams.length}</span></div>
            </div>
            <div className="description"><strong>Description:</strong><p>{tournament.description}</p></div>
            <div className="description"><strong>Details:</strong><p>{tournament.detail}</p></div>
          </div>
          <div className="details-section">
            <h3>Participating Teams ({teams.length})</h3>
            {teams.length === 0 ? (
              <p className="no-teams">No teams participating yet</p>
            ) : (
              <div className="teams-list">
                {teams.map((team) => (
                  <div key={team.id} className="team-item">
                    <div className="team-info">
                      <h4>Team #{team.id}</h4>
                      <p><strong>Description:</strong> {team.description || "N/A"}</p>
                      <p><strong>Points:</strong> {team.points}</p>
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
