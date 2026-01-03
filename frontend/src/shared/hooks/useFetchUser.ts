import { useState, useEffect } from "react";
import { fetchUserById } from "../api/userApi";
import type { User } from "../types/User";

export const useFetchUser = (userId: number | null) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const data = await fetchUserById(userId);
            setUser(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            refetch();
        }
    }, [userId]);

    return { user, loading, error, refetch };
};