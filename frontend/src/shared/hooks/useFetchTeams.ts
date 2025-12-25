import { useState, useEffect } from "react";
import { fetchTeams } from "../../shared/api/teamApi";

export const useFetchTeams = () => {
    const [teams, setTeams] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                setLoading(true);
                const data = await fetchTeams();
                setTeams(data);
                const sortedLeaderboard = [...data]
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 5)
                    .map((team, index) => ({
                        rank: index + 1,
                        teamName: team.description,
                        points: team.points,
                    }));
                setLeaderboard(sortedLeaderboard);
            } catch (err: any) {
                setError(err.message || "Failed to fetch teams.");
            } finally {
                setLoading(false);
            }
        };

        loadTeams();
    }, []);

    return { teams, leaderboard, loading, error };
};