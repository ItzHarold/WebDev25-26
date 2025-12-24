import "./EventList.css";
import React from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "../../../pages/Events/components/FavouritesContext";
import { useAuth } from "../../../features/auth/AuthProvider";
import "../../../shared/styles/FavouriteButton.css";
import type { Event } from "../../../shared/types/Event";

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const {isLiked, toggle} = useFavourites();
    const { user } = useAuth();
    return (
        
        <article className="event-card">
        { user &&(
            <button
            type="button"
            className={`fav-btn fav-bottom-right ${isLiked(event.id) ? "is-liked" : ""}`}
            aria-pressed={isLiked(event.id)}
            aria-label={isLiked(event.id) ? "Remove from favorites" : "Add to favorites"}
            title={isLiked(event.id) ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggle(event.id)}
            >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 20"
                fill={isLiked(event.id) ? "currentColor" : "none"} 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 21s-6.7-4.35-10-9.33C-1.1 6.74 2.13 2 6.5 2 8.87 2 10.5 3.5 12 5.09 13.5 3.5 15.13 2 17.5 2 21.87 2 25.1 6.74 22 11.67 18.7 16.65 12 21 12 21z" />
            </svg>
            </button>
            )}
            <div className="card-media" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>
            <div className="card-body">
                <h3>{event.title}</h3>
                <p className="meta">{event.location} • {event.date} <span className={`status ${event.status.toLowerCase()}`}>{event.status}</span> </p>
                <p className="desc">{event.description}</p>
                <Link to={`/events/${event.id}`}>
                    <button className="btn">View Details</button>
                </Link>
                
            </div>
        </article>
    );
};

export default EventCard;