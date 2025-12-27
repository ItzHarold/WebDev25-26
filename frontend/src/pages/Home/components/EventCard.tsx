import "./EventList.css";
import React from "react";
import { Link } from "react-router-dom";
import type { Event } from "../../../shared/types/Event";
import { useFavouritesBackend } from "../../Favourites/components/useFavouritesBackend";
import FavouriteButton from "../../Favourites/components/FavouriteButton";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const fav = useFavouritesBackend();
  const eventId = Number(event.id);
  

  return (
    <article className="event-card">
      {fav.user && !Number.isNaN(eventId) && (
        <FavouriteButton
          liked={fav.isFavourite(eventId)}
          disabled={fav.isBusy(eventId)}
          onToggle={() => fav.toggleFavourite(eventId)}
        />
      )}

      <div
        className="card-media"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      ></div>

      <div className="card-body">
        <h3>{event.title}</h3>
        <p className="meta">
          {event.location} • {event.date}{" "}
          <span className={`status ${event.status?.toLowerCase()}`}>
            {event.status}
          </span>
        </p>
        <p className="desc">{event.description}</p>

        <Link to={`/events/${event.id}`}>
          <button className="btn">View Details</button>
        </Link>
      </div>
    </article>
  );
};

export default EventCard;
