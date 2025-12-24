import { useState, useEffect } from "react";
import { fetchEvents } from "../api/eventApi";
import type { Event } from "../types/Event";

export const useFetchEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const data = await fetchEvents();
                setEvents(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch events.");
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    return { events, loading, error };
};