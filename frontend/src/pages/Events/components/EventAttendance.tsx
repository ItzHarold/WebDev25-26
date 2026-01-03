import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../features/auth/AuthProvider";
import { useFetchTeams } from "../../../shared/hooks/useFetchTeams";
import {
  addTeamToEvent,
  fetchTeamsByEvent,
  removeTeamFromEventByIds,
} from "../../../shared/api/eventTeamApi";
import type { Team } from "../../../shared/types/Team";


const EventAttendance = ({ eventId }: { eventId: number }) => {
  const { user } = useAuth();
  const { teams } = useFetchTeams();

  const [attendingTeams, setAttendingTeams] = useState<Team[]>([]);
  const [busy, setBusy] = useState(false);

  const isManager = user?.role === "manager";

  const myTeam = useMemo(() => {
    return teams.find((t) => Number(t.managerId) === Number(user?.userId));
  }, [teams, user?.userId]);

  const isInEvent = useMemo(() => {
    if (!myTeam) return false;
    return attendingTeams.some((t) => Number(t.id) === Number(myTeam.id));
  }, [attendingTeams, myTeam]);

  const load = async () => {
    const data = await fetchTeamsByEvent(eventId);
    setAttendingTeams(data);
  };

  useEffect(() => {
    load();
  }, [eventId]);

  const toggle = async () => {
    if (!myTeam) return;

    setBusy(true);
    try {
      if (isInEvent) {
        await removeTeamFromEventByIds(eventId, myTeam.id);
      } else {
        await addTeamToEvent(eventId, myTeam.id);
      }
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h3>Teams attending</h3>

      <ul>
        {attendingTeams.map((t) => (
          <li key={t.id}>{t.description}</li>
        ))}
        {attendingTeams.length === 0 && <li>No teams yet</li>}
      </ul>

      {isManager && (
        <>
          {!myTeam && <p>You need a team before you can attend.</p>}
          {myTeam && (
            <button className="btn" onClick={toggle} disabled={busy}>
              {isInEvent ? "Leave event" : "Attend with my team"}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default EventAttendance;
