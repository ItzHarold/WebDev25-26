import React, { useState } from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useFetchTeams } from "../../shared/hooks/useFetchTeams";
import TeamCard from "../Home/components/TeamCard";
import CreateTeamForm from "./components/CreateTeamForm";
import UpdateTeamForm from "./components/UpdateTeamForm";
import PageHero from "../../shared/ui/PageHero";
import "../../shared/styles/global.css";
import "./TeamPage.css";

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const { teams, loading, error } = useFetchTeams();
  const [isEditing, setIsEditing] = useState(false);

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

        {!loading && !error && myTeam && (
          <div className="team-owned">
            <div className="team-owned-header">
              <h2 className="team-title">Your team</h2>
              {!isEditing ? (
                <button
                  className="team-action"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              ) : (
                <button
                  className="team-action team-action-secondary"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Close
                </button>
              )}
            </div>

            <TeamCard team={myTeam} />

            {isEditing && (
              <div className="team-edit">
                <UpdateTeamForm
                  team={myTeam}
                  onUpdated={() => window.location.reload()}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default TeamPage;
