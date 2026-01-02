import React, { useMemo } from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useFetchTeams } from "../../shared/hooks/useFetchTeams";
import TeamCard from "../Home/components/TeamCard";
import CreateTeamForm from "./components/CreateTeamForm";

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const { teams, loading, error } = useFetchTeams();

  const isAllowed = user?.role === "manager" || user?.role === "admin";
  if (!isAllowed) return <p>No access</p>;

  const myTeam = useMemo(() => {
    if (!user?.userId) return null;
    return teams.find((t) => t.managerId === user.userId) ?? null;
  }, [teams, user?.userId]);

  if (loading) return <p>Loading....</p>;
  if (error) return <p >Error: {error}</p>;

  if (!myTeam) {
    return (
      <main className="team-page">
        <article className="card team-card-wrapper">
          <h1>Team</h1>
          <CreateTeamForm onCreated={() => window.location.reload()} />
        </article>
      </main>
    );
  }

  return (
    <main className="team-page">
      <article className="card team-card-wrapper">
        <h1>Team</h1>

        <section className="team-section">
          <h2>My team</h2>
          <TeamCard team={myTeam} />
        </section>
      </article>
    </main>
  );
};

export default TeamPage;





