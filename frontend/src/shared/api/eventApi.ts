import { getToken } from "../../features/auth/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchEvents = async () => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/event`, {
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

export const fetchEventById = async (id: number) => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
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