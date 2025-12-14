import React from "react";

interface Tournament {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  detail: string;
  status: string;
  imageUrl: string;
  maxTeams: number;
  participatingTeams: string[];
}

interface Team {
  id: string;
  name: string;
  game: string;
  players: number;
  imageUrl: string;
}

interface DashboardStatsProps {
  events: Tournament[];
  teams: Team[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ events, teams }) => {
  const totalEvents = events.length;
  const activeEvents = events.filter(e => 
    e.status === "upcoming" || e.status === "ongoing" || e.status === "live"
  ).length;
  const totalTeams = teams.length;

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">🏆</div>
        <div className="stat-content">
          <h3>{totalEvents}</h3>
          <p>Total Events</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <div className="stat-content">
          <h3>{activeEvents}</h3>
          <p>Active Events</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>{totalTeams}</h3>
          <p>Registered Teams</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
