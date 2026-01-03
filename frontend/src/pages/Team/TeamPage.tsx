import React from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useFetchTeams } from "../../shared/hooks/useFetchTeams";
import TeamCard from "../Home/components/TeamCard";
import CreateTeamForm from "./components/CreateTeamForm";
import "./TeamPage.css";

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const { teams, loading, error } = useFetchTeams();

  const isAllowed = user?.role === "manager" || user?.role === "admin";

  if (!isAllowed) {
    return (
      <main className="team-page">
        <div className="team-box">
          <h1 className="team-title">Team</h1>
          <p className="team-subtitle">You do not have access to this page.</p>
        </div>
      </main>
    );
  }

  const myTeam = teams.find((t) => t.managerId === user?.userId);

  return (
    <main className="team-page">
      <div className="team-box">
        <h1 className="team-title">Team</h1>
        <p className="team-subtitle">Manage your team.</p>

        {loading && <p className="team-muted">Loading…</p>}
        {error && <p className="team-error">Error: {error}</p>}

        {!loading && !error && !myTeam && (
          <>
            <p className="team-muted">You don't have a team yet. Create one.:</p>
            <CreateTeamForm onCreated={() => window.location.reload()} />
          </>
        )}

        {!loading && !error && myTeam && <TeamCard team={myTeam} />}
      </div>
    </main>
  );
};

export default TeamPage;
