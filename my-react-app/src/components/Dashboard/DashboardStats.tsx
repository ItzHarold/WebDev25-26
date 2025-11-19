import React from "react";

interface DashboardStatsProps {
  stats: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">🏆</div>
        <div className="stat-content">
          <h3>{stats.totalEvents}</h3>
          <p>Total Events</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <div className="stat-content">
          <h3>{stats.activeEvents}</h3>
          <p>Active Events</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>{stats.totalTeams}</h3>
          <p>Registered Teams</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
