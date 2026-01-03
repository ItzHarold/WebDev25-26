import { getToken } from "../../features/auth/authStorage";
import type { Team } from "../types/Team";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchTeams = async (): Promise<Team[]> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/team`, {
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
