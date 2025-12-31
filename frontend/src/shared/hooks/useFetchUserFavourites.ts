import { useEffect, useState } from "react";
import { api } from "../api/http";
import type { UserFavourite } from "../types/UserFavourite";

export function useFetchUserFavourites(userId: number | null) {
  const [favourites, setFavourites] = useState<UserFavourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!userId) {
        setFavourites([]);
        setLoading(false);
        return;
    }

    try {
        setLoading(true);
        setError(null);

        const all = await api<UserFavourite[]>("/UserFavourite");
        const mine = all.filter((f) => f.userId === userId);

        setFavourites(mine);

        } catch (e: any) {
        setError(e?.message ?? "Failed to fetch favourites");
        } finally {
        setLoading(false);
        }
    };
    useEffect(() => {
    load();
    }, [userId]);
    return { favourites, setFavourites, loading, error, reload: load };
}
