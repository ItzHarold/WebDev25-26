import { getToken } from "../../features/auth/authStorage";
import type { Event, EventRequest } from "../types/Event";

const API_BASE_URL = "http://localhost:5079";

export const fetchEvents = async (): Promise<Event[]> => {
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

export const fetchEventById = async (id: number): Promise<Event> => {
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

export const createEvent = async (event: EventRequest): Promise<Event> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/event`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json();
};

export const updateEvent = async (id: number, event: EventRequest): Promise<void> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }
};

export const deleteEvent = async (id: number): Promise<void> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
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