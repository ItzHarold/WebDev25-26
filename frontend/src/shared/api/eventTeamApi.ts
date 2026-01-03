import { getToken } from "../../features/auth/authStorage";
import type { EventTeam } from "../types/Event";
import type { Team } from "../types/Team";

const API_BASE_URL = "http://localhost:5079";

// Get all event-team relationships
export const fetchEventTeams = async (): Promise<EventTeam[]> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/eventteam`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json();
};

// Get teams participating in a specific event
export const fetchTeamsByEvent = async (eventId: number): Promise<Team[]> => {
    const eventTeams = await fetchEventTeams();
    const filteredEventTeams = eventTeams.filter(et => et.event.id === eventId);
    return filteredEventTeams.map(et => et.team);
};

// Add a team to an event
export const addTeamToEvent = async (eventId: number, teamId: number): Promise<EventTeam> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/eventteam`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, teamId }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json();
};

// Remove a team from an event (by eventTeam id)
export const removeTeamFromEvent = async (eventTeamId: number): Promise<void> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/eventteam/${eventTeamId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }
};

// Find and remove team from event (convenience function)
export const removeTeamFromEventByIds = async (eventId: number, teamId: number): Promise<void> => {
    const eventTeams = await fetchEventTeams();
    const eventTeam = eventTeams.find(et => et.event.id === eventId && et.team.id === teamId);
    
    if (!eventTeam) {
        throw new Error("Team not found in this event");
    }

    await removeTeamFromEvent(eventTeam.id);
};
