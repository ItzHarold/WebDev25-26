import React from "react";
import type { Event } from "../../../shared/types/Event";
import type { Team } from "../../../shared/types/Team";
import "./DashboardStats.css";

type Tournament = Event & {
  participatingTeams: number[];
};

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
