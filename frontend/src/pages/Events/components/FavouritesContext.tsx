import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  likedIds: string[];
  isLiked: (id: string) => boolean;
  toggle: (id: string) => void;
};

const FavouritesContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "likedEventIds";

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setLikedIds(Array.isArray(arr) ? arr.map(String) : []);
    } catch {
      setLikedIds([]);
    }
  }, []);

  const isLiked = (id: string) => likedIds.includes(String(id));

  const toggle = (id: string) => {
    const key = String(id);
    setLikedIds((prev) => {
      const next = prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const value = useMemo(() => ({ likedIds, isLiked, toggle }), [likedIds]);

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
};

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
