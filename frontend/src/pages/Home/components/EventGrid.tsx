import React from "react";
import EventCard from "./EventCard";
import "./EventList.css";
import type { Event } from "../../../shared/types/Event";

interface EventGridProps {
    events: Event[];
    onFavouriteChanged?: () => void;
}

const EventGrid: React.FC<EventGridProps> = ({ events, onFavouriteChanged }) => {
    if (events.length === 0) {
        return (<p>No events available.</p>)
    };

    return (
        <section className="events-grid">
            {events.map(event => (
                <EventCard key={event.id} event={event} onFavouriteChanged={onFavouriteChanged} />
            ))}
        </section>
    );
};


export default EventGrid;