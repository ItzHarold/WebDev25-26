import { api } from "./http";
import type { Team, TeamRequest } from "../types/Team";

export const fetchTeams = (): Promise<Team[]> =>
    api<Team[]>("/team");

export const fetchTeamById = (id: number): Promise<Team> =>
    api<Team>(`/team/${id}`);

export const createTeam = (team: TeamRequest): Promise<Team> =>
    api<Team>("/team", {
        method: "POST",
        body: JSON.stringify(team),
    });

export const updateTeam = (id: number, team: TeamRequest): Promise<void> =>
    api<void>(`/team/${id}`, {
        method: "PUT",
        body: JSON.stringify(team),
    });

export const deleteTeam = (id: number): Promise<void> =>
    api<void>(`/team/${id}`, {
        method: "DELETE",
    });

export const uploadTeamImage = (teamId: number, file: File) => {
    const formData = new FormData();
    formData.append("ImageUrl", file);
    return api<{ imageUrl: string }>(`/team/${teamId}/upload-image`, {
        method: "POST",
        body: formData,
    });
};