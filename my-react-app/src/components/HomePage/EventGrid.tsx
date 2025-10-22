// components/HomePage/EventGrid.tsx
import React from "react";
import EventCard from "./EventCard";

interface Event {
    id: string;
    title: string;
    location: string;
    date: string;
    description: string;
    imageUrl?: string;
}

interface EventGridProps {
    events: Event[];
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
    return (
        <div className="events-grid">
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventGrid;