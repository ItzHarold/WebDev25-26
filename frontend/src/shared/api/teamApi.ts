import { getToken } from "../../features/auth/authStorage";
import type { Team } from "../types/Team";

export const fetchTeams = (): Promise<Team[]> => {
  return api<Team[]>("/team");
};

export const createTeam = (
  payload: Omit<Team, "id" | "points">
): Promise<Team> => {
  return api<Team>("/team", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      points: 0,
    }),
  });
};
