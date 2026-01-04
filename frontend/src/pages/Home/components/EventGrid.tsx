import React from "react";
import EventCard from "./EventCard";
import "./EventList.css";
import type { Event } from "../../../shared/types/Event";
import { useFavouritesBackend } from "../../Favourites/components/useFavouritesBackend";

interface EventGridProps {
  events: Event[];
  onFavouriteChanged?: () => void;
}

const EventGrid: React.FC<EventGridProps> = ({ events, onFavouriteChanged }) => {
  const fav = useFavouritesBackend();

  if (events.length === 0) {
    return <p>No events available.</p>;
  }

  return (
    <section className="events-grid">
      {events.map((event) => {
        const eventId = Number(event.id);
        const validId = !Number.isNaN(eventId);

        return (
          <EventCard
            key={event.id}
            event={event}
            showFavouriteButton={!!fav.user && validId}
            liked={validId ? fav.isFavourite(eventId) : false}
            disabled={validId ? fav.isBusy(eventId) : false}
            onToggleFavourite={async () => {
              if (!validId) return;
              await fav.toggleFavourite(eventId);
              onFavouriteChanged?.();
            }}
          />
        );
      })}
    </section>
  );
};

export default EventGrid;
