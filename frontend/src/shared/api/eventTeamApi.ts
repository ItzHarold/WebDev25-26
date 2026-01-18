import { api } from "./http";
import type { EventTeam } from "../types/Event";
import type { Team } from "../types/Team";

export const fetchEventTeams = (): Promise<EventTeam[]> =>
    api<EventTeam[]>("/eventteam");

export const fetchTeamsByEvent = async (eventId: number): Promise<Team[]> => {
    const eventTeams = await fetchEventTeams();
    return eventTeams
        .filter(et => et.event.id === eventId)
        .map(et => et.team);
};

export const addTeamToEvent = (eventId: number, teamId: number): Promise<EventTeam> =>
    api<EventTeam>("/eventteam", {
        method: "POST",
        body: JSON.stringify({ eventId, teamId }),
    });

export const removeTeamFromEvent = (eventTeamId: number): Promise<void> =>
    api<void>(`/eventteam/${eventTeamId}`, {
        method: "DELETE",
    });

export const removeTeamFromEventByIds = async (eventId: number, teamId: number): Promise<void> => {
    const eventTeams = await fetchEventTeams();
    const eventTeam = eventTeams.find(et => et.event.id === eventId && et.team.id === teamId);
    
    if (!eventTeam) {
        throw new Error("Team not found in this event");
    }

    await removeTeamFromEvent(eventTeam.id);
};
