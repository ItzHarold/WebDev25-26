import { getToken } from "../../features/auth/authStorage";

const API_BASE_URL = "http://localhost:5079";

export const fetchTeams = async () => {
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