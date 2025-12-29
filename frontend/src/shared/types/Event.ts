export interface Event {
    id: number;
    title: string;
    location?: string;
    date: string;
    description?: string;
    detail?: string;
    status: string;
    imageUrl?: string;
}

export interface EventRequest {
    title: string;
    location?: string;
    date: string;
    description?: string;
    detail?: string;
    status: string;
    imageUrl?: string;
}

export interface EventTeam {
    id: number;
    event: Event;
    team: Team;
}

export interface EventTeamRequest {
    eventId: number;
    teamId: number;
}

// Import Team type
import type { Team } from "./Team";