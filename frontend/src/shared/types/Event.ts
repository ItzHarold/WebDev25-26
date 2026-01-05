import type { Team } from "./Team";

export interface Event {
    id: number;
    title: string;
    location: string;
    date: string;
    description: string | null;
    detail: string | null;
    status: string;
    imageUrl: string | null;
}

export interface EventRequest {
    title: string;
    location: string;
    date: string;
    description: string | null;
    detail: string | null;
    status: string;
    imageUrl: string | null;
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
