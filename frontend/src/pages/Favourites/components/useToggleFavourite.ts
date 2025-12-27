import { useState } from "react";
import { api } from "../../../shared/api/http";

export function useToggleFavourite() {
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());

  const toggle = async (
    userId: number,
    eventId: number,
    favourites: Array<{ id: number; eventId: any }>,
    reload: () => Promise<void>
  ) => {
    setBusyIds(prev => new Set(prev).add(eventId));
    try {
      const existing = favourites.find(f => Number(f.eventId) === Number(eventId));

      if (!existing) {
        await api("/UserFavourite", {
          method: "POST",
          body: JSON.stringify({ userId, eventId }),
        });
      } else {
        await api(`/UserFavourite/${existing.id}`, { method: "DELETE" });
      }
      await reload();
    } finally {
      setBusyIds(prev => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    }
  };

  return { busyIds, toggle };
}
