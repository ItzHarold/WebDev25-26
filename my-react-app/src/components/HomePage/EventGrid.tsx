// components/HomePage/EventGrid.tsx
import React from "react";
import EventCard from "./EventCard";

interface Event {
    id: string;
    title: string;
    location: string;
    date: string;
    description: string;
    status: "live" | "upcoming" | "ended";
    imageUrl?: string;
}

interface EventGridProps {
    events: Event[];
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
    if (events.length === 0) {
        return (<p>No events available.</p>)
    };

    return (
        <div className="events-grid">
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};


export default EventGrid;