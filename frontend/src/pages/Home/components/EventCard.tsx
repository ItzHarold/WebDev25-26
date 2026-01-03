import "./EventList.css";
import React from "react";
import { Link } from "react-router-dom";
import type { Event } from "../../../shared/types/Event";
import FavouriteButton from "../../Favourites/components/FavouriteButton";
import ImageBackground from "../../../shared/ui/ImageBackground";

interface EventCardProps {
  event: Event;
  showFavouriteButton?: boolean;
  liked?: boolean;
  disabled?: boolean;
  onToggleFavourite?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({event, showFavouriteButton, liked = false, disabled = false,
  onToggleFavourite,}) => { const eventId = Number(event.id);
const backendUrl = import.meta.env.VITE_API_URL;
    const getEventImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith("http")) return imageUrl;
    return backendUrl + imageUrl;
    };

  const defaultEventImage = '/default-event.jpg'; // Place this image in your public folder
  const imageUrl = event.imageUrl ? getEventImageUrl(event.imageUrl) : defaultEventImage;
  return (
    <article className="event-card">
      {showFavouriteButton && !Number.isNaN(eventId) && (
        <FavouriteButton
          liked={liked}
          disabled={disabled}
          onToggle={onToggleFavourite ?? (() => {})}
        />
      )}
      <ImageBackground
  imageUrl={event.imageUrl}
  defaultImage="/default-event.jpg"
  className="card-media"
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