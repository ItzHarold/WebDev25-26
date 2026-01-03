import { api } from "./http";
import type { Team } from "../types/Team";

export const fetchTeams = () => 
    api<Team[]>("/team");