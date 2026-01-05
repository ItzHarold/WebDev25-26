import { useMemo, useState } from "react";
import { useAuth } from "../../../features/auth/AuthProvider";
import { api } from "../../../shared/api/http";
import { useFetchUserFavourites } from "../../../shared/hooks/useFetchUserFavourites";

export function useFavouritesBackend() {
  const { user } = useAuth();
  const userId = user?.userId ?? null;

  const { favourites, loading, error, reload } = useFetchUserFavourites(userId);
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());

  const favouriteIds = useMemo(() => {
    return new Set(favourites.map((f) => Number(f.eventId)));
  }, [favourites]);

  const isFavourite = (eventId: number) => favouriteIds.has(Number(eventId));
  const isBusy = (eventId: number) => busyIds.has(Number(eventId));

  const toggleFavourite = async (eventId: number) => {
    if (!userId) return;

    const id = Number(eventId);
    setBusyIds((prev) => new Set(prev).add(id));

    try {
      const existing = favourites.find((f) => Number(f.eventId) === id);

      if (!existing) {
        await api("/UserFavourite", {
          method: "POST",
          body: JSON.stringify({ userId, eventId: id }),
        });
      } else {
        await api(`/UserFavourite/${existing.id}`, { method: "DELETE" });
      }

      await reload();
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return {
    user,
    favouriteIds,
    favourites,
    isFavourite,
    isBusy,
    toggleFavourite,
    loading,
    error,
  };
}
