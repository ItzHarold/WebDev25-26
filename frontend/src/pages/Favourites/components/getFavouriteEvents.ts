import type { Event } from "../../../shared/types/Event";

type FavouriteLike = {
  eventId: number | string;
};

export function getFavouriteEvents(
  events: Event[],
  favourites: FavouriteLike[]
): Event[] {
  const favouriteIds = new Set(
    favourites.map((f) => Number(f.eventId))
  );

  return events.filter((event) =>
    favouriteIds.has(Number(event.id))
  );
}
