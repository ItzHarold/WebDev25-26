import "./EventList.css";
import React from "react";
import { Link } from "react-router-dom";
import type { Event } from "../../../shared/types/Event";
import FavouriteButton from "../../Favourites/components/FavouriteButton";

interface EventCardProps {
  event: Event;
  showFavouriteButton?: boolean;
  liked?: boolean;
  disabled?: boolean;
  onToggleFavourite?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({event, showFavouriteButton, liked = false, disabled = false,
  onToggleFavourite,}) => { const eventId = Number(event.id);

  return (
    <article className="event-card">
      {showFavouriteButton && !Number.isNaN(eventId) && (
        <FavouriteButton
          liked={liked}
          disabled={disabled}
          onToggle={onToggleFavourite ?? (() => {})}
        />
      )}
      <div
        className="card-media"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      />
      <div className="card-body">
        <h3>{event.title}</h3>
        <p className="meta">
          {event.location} • {event.date}{" "}
          <span className={`status ${event.status?.toLowerCase?.() ?? ""}`}>
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