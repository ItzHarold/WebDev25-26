import { useState, useEffect } from "react";
import { fetchTeams } from "../api/teamApi";
import type { Team } from "../types/Team";

export const useFetchTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                setLoading(true);
                const data = await fetchTeams();
                setTeams(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch teams.");
            } finally {
                setLoading(false);
            }
        };

        loadTeams();
    }, []);

    return { teams, loading, error };
};