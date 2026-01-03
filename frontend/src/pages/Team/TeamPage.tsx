import React from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useFetchTeams } from "../../shared/hooks/useFetchTeams";
import TeamCard from "../Home/components/TeamCard";
import CreateTeamForm from "./components/CreateTeamForm";
import PageHero from "../../shared/ui/PageHero";
import "../../shared/styles/global.css";
import "./TeamPage.css";

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const { teams, loading, error } = useFetchTeams();

  const isAllowed = user?.role === "manager";

  if (!isAllowed) {
    return (
      <>
        <PageHero
          title="Team"
          subtitle="You do not have access to this page."
          backgroundImageUrl="HeroStock.jpg"
        />
        <main className="team-page">
          <p className="team-muted">You do not have access to this page.</p>
        </main>
      </>
    );
  }

  const myTeam = teams.find((t) => t.managerId === user?.userId);

  return (
    <>
      <PageHero
        title="Team"
        subtitle="Manage your team."
        backgroundImageUrl="HeroStock.jpg"
      />

      <main className="team-page">
        {loading && <p className="team-muted">Loading…</p>}
        {error && <p className="team-error">Error: {error}</p>}

        {!loading && !error && !myTeam && (
          <div className="team-empty-state">
            <p className="team-muted">You don't have a team yet. Create one:</p>
            <CreateTeamForm onCreated={() => window.location.reload()} />
          </div>
        )}

        {!loading && !error && myTeam && <TeamCard team={myTeam} />}
      </main>
    </>
  );
};

export default TeamPage;
