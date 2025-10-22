// components/HomePage/EventCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Event {
    id: string;
    title: string;
    location: string;
    date: string;
    description: string;
    imageUrl?: string;
}

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <article className="event-card">
            <div className="card-media">
                {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
            </div>
            <div className="card-body">
                <h3>{event.title}</h3>
                <p className="meta">{event.location} • {event.date}</p>
                <p className="desc">{event.description}</p>
                <Link to={`/events/`}>
                    <button className="btn">View Details</button>
                </Link>
            </div>
        </article>
    );
};

export default EventCard;